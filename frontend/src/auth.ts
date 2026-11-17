// The one place that knows where the login token is stored.
// Everything else calls these three functions, so switching storage
// later (e.g. to cookies) only means changing this file.

const TOKEN_KEY = 'focusme_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
