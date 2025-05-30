// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'
import Navbar from './components/Navbar'
import { useAuth } from './hooks/useAuth'

type LocationState = { demo?: boolean }

export default function App() {
  const { user } = useAuth()
  const location = useLocation()
  const state = location.state as LocationState
  const isAuthed = Boolean(user) || state?.demo

  return (
    <>
      {isAuthed && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/"
          element={isAuthed ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthed ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  )
}
