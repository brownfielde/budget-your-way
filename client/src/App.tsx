// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // Update if your server runs elsewhere
});

// Auth middleware (optional, for JWT)
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  // Pull the `demo` flag from navigation state:
  const fromDemo = (location.state as any)?.demo === true;
  const isAuthed = !!user || fromDemo;

  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
};

export default App;
