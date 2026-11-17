import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { signup } from '../api'

export default function SignupPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault() // stop the browser reloading the page
    setError('')
    setLoading(true)
    try {
      await signup(username, password)
      navigate('/login', { state: { signedUp: true } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Sign up</h1>
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
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  )
}
