import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return setError('Please fill in all fields')
    try {
      await login(email, password)
      navigate('/', { replace: true, state: { demo: false } })
    } catch {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="login-page">
      <header className="logo"><h1>💰 Your Budget Dashboard</h1></header>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="add-tx-form">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} required />
        {error && <div style={{margin:'0.5rem 0',color:'#d23f44',fontSize:'0.9rem',textAlign:'center',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'4px',padding:'0.5rem'}}>{error}</div>}
        <div className="login-buttons">
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          <button type="button" onClick={() => { localStorage.setItem('demoMode','true'); navigate('/', { replace: true, state: { demo: true } }) }} disabled={loading}>Demo</button>
        </div>
        <div style={{marginTop:'1rem',fontSize:'0.9rem',color:'var(--muted)',textAlign:'center'}}>
          Demo Mode: Skip login and explore the app<br/>
          <span style={{fontSize:'0.8rem'}}>For login demo, use any email and password</span>
        </div>
      </form>
    </div>
  )
}