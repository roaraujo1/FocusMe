import { useState } from 'react'
import { useNavigate } from 'react-router'
import { saveFocusSession, UnauthorizedError } from '../api'
import { clearToken } from '../auth'
import { useStopwatch } from '../useStopwatch'
import { formatElapsed, toLocalDateString } from '../time'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function Timer() {
  const navigate = useNavigate()
  const { running, elapsedMs, start, stop } = useStopwatch()
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState('')

  function handleStart() {
    setStatus('idle') // clear the last "saved" or error message
    setError('')
    start()
  }

  // Stopping the timer saves the session automatically.
  async function handleStop() {
    const session = stop()
    if (!session) return

    setStatus('saving')
    try {
      await saveFocusSession(toLocalDateString(session.startedAt), session.seconds)
      setStatus('saved')
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        clearToken()
        navigate('/login', { replace: true, state: { sessionExpired: true } })
        return
      }
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not save the session.')
    }
  }

  return (
    <section>
      <p className="elapsed">{formatElapsed(elapsedMs)}</p>
      {running ? (
        <button onClick={handleStop}>Stop</button>
      ) : (
        <button onClick={handleStart} disabled={status === 'saving'}>
          Start
        </button>
      )}
      {status === 'saving' && <p>Saving…</p>}
      {status === 'saved' && <p className="success">Session saved.</p>}
      {status === 'error' && <p className="error">{error}</p>}
    </section>
  )
}
