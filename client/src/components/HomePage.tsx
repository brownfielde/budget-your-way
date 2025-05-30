import React, { useState, FormEvent } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
}

interface Budget {
  Groceries: number;
  "Debt Owed": number;
  Rent: number;
  Utilities: number;
}

const BUDGETS = { Groceries: 500, 'Debt Owed': 1000, Rent: 1200, Utilities: 300 };
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2025-05-27', category: 'Groceries', description: 'Whole Foods', amount: 75, type: 'expense' },
  { id: 2, date: '2025-05-26', category: 'Debt Owed', description: 'Credit Card', amount: 200, type: 'expense' },
  { id: 3, date: '2025-05-25', category: 'Rent', description: 'May rent', amount: 1200, type: 'expense' },
  { id: 4, date: '2025-05-24', category: 'Utilities', description: 'Electric bill', amount: 60, type: 'expense' },
  { id: 5, date: '2025-05-23', category: 'Income', description: 'Paycheck', amount: 3000, type: 'income' }
];
const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#8884D8'];

const HomePage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
   const [budgets, setBudgets] = useState<Budget>(BUDGETS);

  const [form, setForm] = useState<Partial<Transaction>>({ date: '', category: '', description: '', amount: 0, type: 'expense' });

  const expenseData = Object.entries(
    transactions
      .filter(t => t.type === 'expense')
      .reduce<Record<string, number>>((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {})
  ).map(([name, value]) => ({ name, value }));

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (form.date && form.category && form.description && form.amount) {
      setTransactions([
        ...transactions,
        { 
          id: Math.max(0, ...transactions.map(t => t.id)) + 1,
          ...form as Omit<Transaction, 'id'>
        }
      ]);
      setForm({ date: '', category: '', description: '', amount: 0, type: 'expense' });
    }
  };

  return (
    <div className="home-page">
      <header className="dashboard-header"><h1>Your Budget Dashboard</h1></header>

      <section className="summary-cards">
        {Object.entries(budgets).map(([cat, budget]) => {
          const spent = transactions.filter(t => t.category === cat && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
          const pct = Math.min(Math.round((spent / budget) * 100), 100);
          return (
            <div key={cat} className="summary-card">
              <h3>{cat}</h3>
              <p className="amount">${spent} / ${budget}</p>
              <progress value={spent} max={budget}></progress>
              <span className="pct">{pct}%</span>
            </div>
          );
        })}
      </section>

      <section className="chart-section">
        <h2>Expense Breakdown</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={80} label>
              {expenseData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="transactions-section">
        <h2>Recent Transactions</h2>
        <table className="transactions-table">
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
          <tbody>
            {transactions.slice(-5).reverse().map(tx => (
              <tr key={tx.id}>
                <td>{tx.date}</td><td>{tx.category}</td><td>{tx.description}</td>
                <td className={tx.type}>{tx.type === 'expense' ? `-$${tx.amount}` : `+$${tx.amount}`}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <form className="add-tx-form" onSubmit={handleAdd}>
          <input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} required />
          {/* <input type="text" placeholder="Category" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} required /> */}
          <select value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} required>
            <option value="">Select Category</option>
            {form.type === 'income' ? (
            <option value="Income">Income</option>
            ) : (
            Object.keys(budgets).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))
            )}
            </select>
          <input type="text" placeholder="Description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <input type="number" placeholder="Amount" value={form.amount || ''} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} required />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit">Add</button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;