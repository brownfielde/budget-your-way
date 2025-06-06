import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';

const Navbar: React.FC = () => {
  
const user = Auth.getProfile(); // Assuming Auth.getUser() returns the current user object
  const navigate = useNavigate();

  const handleLogout = () => {
    Auth.logout();
    
  };

  return (
    <nav className="navbar">
      <div className="logo">💰 BudgetTracker</div>
      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/information">Information</NavLink>
      </div>
      <div className="user-actions">
        {user && <span className="welcome">Hi, {user.username}</span>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
