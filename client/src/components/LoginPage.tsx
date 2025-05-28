// src/components/LoginPage.tsx
import React, { FormEvent, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/', { replace: true });
    } catch {
      alert('Login failed');
    }
  };

  // Demo button just navigates to "/" with a flag
  const handleDemo = () => {
    nav('/', { replace: true, state: { demo: true } });
  };

  return (
    <div className="login-page">
      <header className="dashboard-header"><h1><span className='icon' style={{color:"none !important"}}>💰</span>Your Budget Dashboard</h1></header>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="formGroupExampleInput" className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="button" className="btn btn-dark">Login</button>
          <button
            type="button" className="btn btn-primary"
            onClick={handleDemo}
            style={{ marginLeft: 8 }}
          >
            Demo
          </button>
          
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
