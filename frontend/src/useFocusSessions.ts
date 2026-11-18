import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getFocusSessions, UnauthorizedError, type FocusSession } from './api'
import { clearToken } from './auth'

// Loads the user's sessions once when the page opens.
// A 401 clears the token and sends the user to login.
export function useFocusSessions() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // If the user leaves the page before the request finishes, ignore the result.
    let ignore = false

    getFocusSessions()
      .then((data) => {
        if (!ignore) setSessions(data)
      })
      .catch((err) => {
        if (ignore) return
        if (err instanceof UnauthorizedError) {
          clearToken()
          navigate('/login', { replace: true, state: { sessionExpired: true } })
          return
        }
        setError(err instanceof Error ? err.message : 'Could not load your sessions.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [navigate])

  return { sessions, loading, error }
}
