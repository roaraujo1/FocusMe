// All calls to the FastAPI backend live here.
import { getToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL

// fetch() only throws when no response arrived at all (server down,
// wrong VITE_API_URL, CORS blocked). Give that a readable message.
async function request(path: string, options: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, options)
  } catch {
    throw new Error('Could not reach the server. Please try again.')
  }
}

// FastAPI puts error text in `detail`. It's a string for errors we raise
// ourselves (401, 400) and a list of objects for validation errors (422).
async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json()
    if (typeof body.detail === 'string') return body.detail
    if (Array.isArray(body.detail)) return body.detail[0]?.msg ?? fallback
  } catch {
    // Body wasn't JSON; use the fallback.
  }
  return fallback
}

// POST /signup expects JSON: { username, password }.
// On success it returns { user: "user was created" }.
export async function signup(username: string, password: string): Promise<void> {
  const res = await request('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (res.status === 400) {
    throw new Error('That username is already taken.')
  }
  if (!res.ok) {
    throw new Error(await readError(res, 'Sign up failed. Please try again.'))
  }
}

// POST /token is OAuth2's password flow, so it expects a *form*
// (application/x-www-form-urlencoded), not JSON.
// On success it returns { access_token, token_type: "bearer" }.
export async function login(username: string, password: string): Promise<string> {
  const res = await request('/token', {
    method: 'POST',
    body: new URLSearchParams({ username, password }),
  })

  if (res.status === 401) {
    throw new Error('Wrong username or password.')
  }
  if (!res.ok) {
    throw new Error(await readError(res, 'Log in failed. Please try again.'))
  }

  const data: { access_token: string; token_type: string } = await res.json()
  return data.access_token
}

// For later requests to protected endpoints (e.g. /focus-sessions).
// Adds the "Authorization: Bearer <token>" header the backend reads
// to work out who the user is.
export function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return request(path, { ...options, headers })
}

// Thrown when the backend rejects the token (missing, expired or invalid),
// so the page can tell "log in again" apart from other failures.
export class UnauthorizedError extends Error {}

// POST /focus-sessions expects JSON: { session_date: "YYYY-MM-DD", time: <int> }.
// `time` is the session length in whole seconds.
// We never send a user id: the backend takes it from the token.
export async function saveFocusSession(sessionDate: string, seconds: number): Promise<void> {
  const res = await authFetch('/focus-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_date: sessionDate, time: seconds }),
  })

  if (res.status === 401) {
    throw new UnauthorizedError('Your login has expired. Please log in again.')
  }
  if (!res.ok) {
    throw new Error(await readError(res, 'Could not save the session. Please try again.'))
  }
}

// One row from GET /focus-sessions.
// session_date is a plain "YYYY-MM-DD" string (no time of day, no time zone).
// time is the length in seconds.
export type FocusSession = {
  id: number
  user_id: number
  session_date: string
  time: number
}

// GET /focus-sessions returns all of the logged-in user's sessions.
export async function getFocusSessions(): Promise<FocusSession[]> {
  const res = await authFetch('/focus-sessions')

  if (res.status === 401) {
    throw new UnauthorizedError('Your login has expired. Please log in again.')
  }
  if (!res.ok) {
    throw new Error(await readError(res, 'Could not load your sessions. Please try again.'))
  }
  return res.json()
}
