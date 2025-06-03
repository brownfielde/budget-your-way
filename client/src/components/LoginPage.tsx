// src/components/LoginPage.tsx
import React, { FormEvent, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../utils/mutations';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';


const LoginPage: React.FC = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
        
      });

      Auth.login(data.login.token);
      navigate('/', { replace: true, state: { demo: false } })
    } catch (e) {
      console.error(e);
    }

    setFormState({
      email: '',
      password: '',
    });
  };



  return (
    <div className="login-page">
      <header className="logo"><h1>💰 Your Budget Dashboard</h1></header>
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit} className="add-tx-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          placeholder="Your email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input 
          id="password"
          placeholder="******"
          name="password"
          type="password"
          value={formState.password}
          onChange={handleChange}
        />
        {error && <div style={{margin:'0.5rem 0',color:'#d23f44',fontSize:'0.9rem',textAlign:'center',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'4px',padding:'0.5rem'}}>{error.message}</div>}
        <div className="login-buttons">
          <button type="submit">Login</button>
          <button type="submit" onClick={() => { localStorage.setItem('demoMode','true'); navigate('/', { replace: true, state: { demo: true } }) }} >Demo</button>
        </div>
        <div style={{marginTop:'1rem',fontSize:'0.9rem',color:'var(--muted)',textAlign:'center'}}>
          Demo Mode: Skip login and explore the app<br/>
          <span style={{fontSize:'0.8rem'}}>For login demo, use any email and password</span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
