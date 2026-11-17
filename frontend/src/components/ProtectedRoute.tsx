import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { getToken } from '../auth'

// Wrap any page that needs a logged-in user.
// No token → send to /login instead of showing the page.
// This is only a UX guard: the backend still checks the token on every request.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }
  return children
}
