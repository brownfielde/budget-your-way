import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="logo">💰 BudgetTracker</div>
      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
      </div>
      <div className="user-actions">
        {user && <span className="welcome">Hi, {user.name}</span>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
