import { Navigate, Route, Routes } from 'react-router'
import CalendarPage from './pages/CalendarPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/ProtectedRoute'

// Maps each URL to a page.
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      {/* Any unknown URL goes home (which redirects to login if needed). */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
