import { useState, useEffect, FormEvent } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LabelList, ResponsiveContainer
} from 'recharts'

interface Transaction {
  id: number
  date: string
  category: string
  description: string
  amount: number
  type: 'expense' | 'income'
}

const INITIAL_BUDGETS = { Groceries: 500, 'Debt Owed': 1000, Rent: 1200, Utilities: 300 }
const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28']

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2025-05-27', category: 'Groceries', description: 'Whole Foods', amount: 75, type: 'expense' },
  { id: 2, date: '2025-05-26', category: 'Debt Owed', description: 'Credit Card', amount: 200, type: 'expense' },
  { id: 3, date: '2025-05-25', category: 'Rent', description: 'May rent', amount: 1200, type: 'expense' },
  { id: 4, date: '2025-05-24', category: 'Utilities', description: 'Electric bill', amount: 60, type: 'expense' },
  { id: 5, date: '2025-05-23', category: 'Income', description: 'Paycheck', amount: 3000, type: 'income' }
]

const labelFormatter = (value: number, data: any) => {
  const budget = data?.budget || 0
  const percentage = budget > 0 ? Math.round((value / budget) * 100) : 0
  return `$${value}/$${budget} (${percentage}%)`
}

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
`

export default function HomePage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS)
  const [editingBudgets, setEditingBudgets] = useState(false)
  const [tempBudgets, setTempBudgets] = useState(INITIAL_BUDGETS)
  const [form, setForm] = useState<Omit<Transaction, 'id'>>({
    date: '', category: '', description: '', amount: 0, type: 'expense'
  })

  // Fetch transactions from GraphQL or use static data
  useEffect(() => {
  const demoMode = localStorage.getItem('demoMode') === 'true'
  // Always start with static data
  setTransactions(INITIAL_TRANSACTIONS)

  if (demoMode) return // Only static data in demo mode

  fetch('/graphql', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({ query: TRANSACTIONS_QUERY }),
  })
    .then(res => res.json())
    .then(result => {
      if (result.data && result.data.transactions) {
        // Merge static and fetched, avoiding duplicate IDs
        setTransactions(prev => {
          const staticIds = new Set(prev.map(t => t.id))
          const newTxs = result.data.transactions.filter((t: any) => !staticIds.has(t.id))
          return [...prev, ...newTxs]
        })
      }
    })
    .catch(() => {
      // On error, keep static data
    })
}, [])

  /* ----------  Pie chart data ---------- */
  const expenseData = Object.entries(
    transactions.filter(t => t.type === 'expense')
      .reduce((acc, { category, amount }) => {
        acc[category] = (acc[category] || 0) + amount
        return acc
      }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  /* ----------  Bar chart data ---------- */
  const barData = Object.entries(budgets).map(([category, budget]) => {
    const spent = transactions.filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, { amount }) => sum + amount, 0)
    return { category, spent, budget }
  })
  const maxBudget = Math.max(...Object.values(budgets))

  /* ----------  Income vs Expenses data ---------- */
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const incomeExpenseData = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpenses, fill: '#ef4444' },
    { name: 'Remaining', amount: Math.max(0, totalIncome - totalExpenses), fill: '#06b6d4' }
  ]

  /* ----------  Handle form submit ---------- */
  const handleAdd = (e: FormEvent) => {
    e.preventDefault()
    const { date, category, description, amount, type } = form
    if (date && category && description && amount) {
      setTransactions(txs => [
        ...txs,
        { id: Math.max(0, ...txs.map(t => t.id)) + 1, date, category, description, amount, type }
      ])
      setForm({ date: '', category: '', description: '', amount: 0, type })
    }
  }

  /* ----------  Budget editing ---------- */
  const startEditingBudgets = () => {
    setTempBudgets({...budgets})
    setEditingBudgets(true)
  }

  const saveBudgets = () => {
    setBudgets({...tempBudgets})
    setEditingBudgets(false)
  }

  const cancelEditingBudgets = () => {
    setTempBudgets({...budgets})
    setEditingBudgets(false)
  }

  return (
    <div className="home-page">
      {/* ===== Header ===== */}
      <header className="dashboard-header text-center">
        <h1>Your Budget Dashboard</h1>
      </header>

      {/* ===== Charts Row (Bar left, Pie right, Income/Expense bottom) ===== */}
      <section className="chart-grid">
        {/* Left – Budget Progress Bar Chart */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Budget Progress</h3>
            {!editingBudgets ? (
              <button onClick={startEditingBudgets} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Edit Budgets
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={saveBudgets} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#10b981' }}>
                  Save
                </button>
                <button onClick={cancelEditingBudgets} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#ef4444' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          {editingBudgets && (
            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Edit Budget Limits:</h4>
              {Object.entries(tempBudgets).map(([category, amount]) => (
                <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <label style={{ minWidth: '80px', fontSize: '0.8rem' }}>{category}:</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setTempBudgets(prev => ({...prev, [category]: Number(e.target.value)}))}
                    style={{ padding: '0.3rem', fontSize: '0.8rem', width: '100px' }}
                  />
                </div>
              ))}
            </div>
          )}

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 120, left: 100, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, maxBudget]} />
              <YAxis type="category" dataKey="category" width={100} />
              <Tooltip formatter={(v: number) => `$${v}`} />
              <Bar dataKey="spent" fill="#4f46e5" barSize={18} radius={[0, 6, 6, 0]}>
                <LabelList dataKey="spent" position="right" formatter={labelFormatter} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right – Pie Chart */}
        <div className="chart-card">
          <h3>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={80} label>
                {expenseData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `$${v}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===== Income vs Expenses Chart ===== */}
      <section className="chart-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="chart-card">
          <h3>Financial Overview</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>+${totalIncome}</div>
              <div>Total Income</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>-${totalExpenses}</div>
              <div>Total Expenses</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: totalIncome - totalExpenses >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>
                ${totalIncome - totalExpenses}
              </div>
              <div>Net Balance</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incomeExpenseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v: number) => `$${v}`} />
              <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                {incomeExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===== Recent Transactions & Add Form ===== */}
      <section className="transactions-section">
        <h2>Recent Transactions</h2>
        <table className="transactions-table">
          <thead>
            <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {transactions.slice(-5).reverse().map(({ id, date, category, description, amount, type }) => (
              <tr key={id}>
                <td>{date}</td>
                <td>{category}</td>
                <td>{description}</td>
                <td className={type}>{type === 'expense' ? `-$${amount}` : `+$${amount}`}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="add-tx-form">
          <input 
            type="date" 
            value={form.date} 
            onChange={e => setForm({ ...form, date: e.target.value })} 
            required 
          />
          <select 
            value={form.category} 
            onChange={e => setForm({ ...form, category: e.target.value })} 
            required
          >
            <option value="">Select Category</option>
            {Object.keys(budgets).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            <option value="Income">Income</option>
          </select>
          <input 
            placeholder="Description" 
            value={form.description} 
            onChange={e => setForm({ ...form, description: e.target.value })} 
            required 
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={form.amount || ''} 
            onChange={e => setForm({ ...form, amount: +e.target.value })} 
            required 
          />
          <select 
            value={form.type} 
            onChange={e => setForm({ ...form, type: e.target.value as any })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button onClick={handleAdd}>Add</button>
        </div>
      </section>
    </div>
  )
}