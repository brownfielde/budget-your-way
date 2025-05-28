// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  // Pull the `demo` flag from navigation state:
  const fromDemo = (location.state as any)?.demo === true;
  const isAuthed = !!user || fromDemo;

  return (
    <div>
      {isAuthed && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={
            isAuthed
              ? <HomePage />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
