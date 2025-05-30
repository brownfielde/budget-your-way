import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="logo">💰 BudgetTracker</div>
      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
      </div>
      <div className="user-actions">
        {user && <span className="welcome">Hi, {user.name}</span>}
        <button onClick={() => { logout(); navigate('/login', { replace: true }) }}>Logout</button>
      </div>
    </nav>
  )
}
