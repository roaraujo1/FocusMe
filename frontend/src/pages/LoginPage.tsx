import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { login } from '../api'
import { setToken } from '../auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // SignupPage passes { signedUp: true } when it sends the user here.
  const justSignedUp = location.state?.signedUp === true
  // Timer passes { sessionExpired: true } when the backend rejected the token.
  const sessionExpired = location.state?.sessionExpired === true

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await login(username, password)
      setToken(token)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Log in</h1>
      {justSignedUp && <p className="success">Account created. Please log in.</p>}
      {sessionExpired && <p className="error">Your login expired. Please log in again.</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p>
        No account yet? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  )
}
