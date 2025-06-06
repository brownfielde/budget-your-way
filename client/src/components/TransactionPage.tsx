// import { useQuery } from "@apollo/client";

// import Transactionform from "./Transactionform";
// import { QUERY_TRANSACTIONS } from "../utils/queries";

// const TransactionPage= () => {
//     const {loading, data} = useQuery(QUERY_TRANSACTIONS);
//     const transactions = data?.transactions || [];
//     if (loading) return <p>Loading...</p>;
//     return (
//         <div>
//             <h2>Your Transactions</h2>
//             <Transactionform />
//             <ul>
//                 {transactions.map((tx) => (
//                     <li key={tx._id}>
//                         {tx.date} - {tx.description}: ${tx.amount}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
import React, { useState, useEffect, FormEvent } from "react";
interface Transaction {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: "expense" | "income";
}
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: "2025-05-27",
    category: "Groceries",
    description: "Whole Foods",
    amount: 75,
    type: "expense",
  },
  {
    id: 2,
    date: "2025-05-26",
    category: "Debt Owed",
    description: "Credit Card",
    amount: 200,
    type: "expense",
  },
  {
    id: 3,
    date: "2025-05-25",
    category: "Rent",
    description: "May rent",
    amount: 1200,
    type: "expense",
  },
  {
    id: 4,
    date: "2025-05-24",
    category: "Utilities",
    description: "Electric bill",
    amount: 60,
    type: "expense",
  },
  {
    id: 5,
    date: "2025-05-23",
    category: "Income",
    description: "Paycheck",
    amount: 3000,
    type: "income",
  },
  {
    id: 6,
    date: "2025-05-22",
    category: "Groceries",
    description: "Target",
    amount: 45,
    type: "expense",
  },
  {
    id: 7,
    date: "2025-05-21",
    category: "Utilities",
    description: "Internet bill",
    amount: 80,
    type: "expense",
  },
  {
    id: 8,
    date: "2025-05-20",
    category: "Groceries",
    description: "Local market",
    amount: 32,
    type: "expense",
  },
  {
    id: 9,
    date: "2025-05-19",
    category: "Income",
    description: "Freelance work",
    amount: 500,
    type: "income",
  },
  {
    id: 10,
    date: "2025-05-18",
    category: "Debt Owed",
    description: "Student loan",
    amount: 150,
    type: "expense",
  },
];
const CATEGORIES = ["Groceries", "Debt Owed", "Rent", "Utilities", "Income"];
const TRANSACTIONS_QUERY = `
  query {
    transactions {
      id
      date
      category
      description
      amount
      type
    }
  }
`;
const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [form, setForm] = useState<Omit<Transaction, "id">>({
    date: "",
    category: "",
    description: "",
    amount: 0,
    type: "expense",
  });
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  // Fetch transactions from GraphQL or use static data
  useEffect(() => {
    const demoMode = localStorage.getItem("demoMode") === "true";
    // Always start with static data
    setTransactions(INITIAL_TRANSACTIONS);
    setFilteredTransactions(INITIAL_TRANSACTIONS);
    if (demoMode) return; // Only static data in demo mode
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_JWT_TOKEN",
      },
      body: JSON.stringify({ query: TRANSACTIONS_QUERY }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.transactions) {
          // Merge static and fetched, avoiding duplicate IDs
          setTransactions((prev) => {
            const staticIds = new Set(prev.map((t) => t.id));
            const newTxs = result.data.transactions.filter(
              (t: any) => !staticIds.has(t.id)
            );
            const merged = [...prev, ...newTxs];
            setFilteredTransactions(merged);
            return merged;
          });
        }
      })
      .catch(() => {
        // On error, keep static data
      });
  }, []);
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...transactions];
    // Apply filters
    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }
    if (filters.type) {
      filtered = filtered.filter((t) => t.type === filters.type);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((t) => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((t) => t.date <= filters.dateTo);
    }
    if (filters.search) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "date":
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
          break;
        case "category":
          aVal = a.category.toLowerCase();
          bVal = b.category.toLowerCase();
          break;
        default:
          return 0;
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    setFilteredTransactions(filtered);
  }, [transactions, filters, sortBy, sortOrder]);
  const handleDeleteTransaction = (id: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };
  const handleSort = (column: "date" | "amount" | "category") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };
  const clearFilters = () => {
    setFilters({
      category: "",
      type: "",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
  };
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return (
    <div className="transactions-page">
      <header className="dashboard-header text-center">
        <h1>All Transactions</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "1rem",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "#10B981",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              +${totalIncome}
            </div>
            <div>Total Income</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "#EF4444",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              -${totalExpenses}
            </div>
            <div>Total Expenses</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: totalIncome - totalExpenses >= 0 ? "#10B981" : "#EF4444",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              ${totalIncome - totalExpenses}
            </div>
            <div>Net Balance</div>
          </div>
        </div>
      </header>
      {/* Filters and Search */}
      <section className="filters-section">
        <h3>Filter & Search</h3>
        <div className="filters-grid">
          <input
            type="text"
            placeholder="Search description or category..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="date"
            placeholder="From Date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="To Date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      </section>
      {/* Transactions Table */}
      <section className="transactions-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2>Transactions ({filteredTransactions.length})</h2>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </div>
        </div>
8:37
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("date")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("category")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Category{" "}
                  {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Description</th>
                <th
                  onClick={() => handleSort("amount")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Amount{" "}
                  {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(
                ({ id, date, category, description, amount, type }) => (
                  <tr key={id}>
                    <td>{new Date(date).toLocaleDateString()}</td>
                    <td>{category}</td>
                    <td>{description}</td>
                    <td className={type}>
                      {type === "expense"
                        ? `-$${amount.toFixed(2)}`
                        : `+$${amount.toFixed(2)}`}
                    </td>
                    <td>
                      <span className={`type-badge ${type}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteTransaction(id)}
                        style={{
                          background: "#EF4444",
                          color: "white",
                          border: "none",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No transactions found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
export default TransactionsPage;
