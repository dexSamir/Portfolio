const TOKEN_KEY = 'portfolio_jwt_token';
let memoryToken: string | null = null;

// This is a UX expiry check only. The API must verify JWT signatures and roles.
export function isTokenCurrent(token: string, now = Date.now()): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && Number.isFinite(payload.exp) && payload.exp * 1000 > now;
  } catch { return false; }
}
export function clearSession() {
  memoryToken = null;
  try { sessionStorage.removeItem(TOKEN_KEY); localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('editingProject'); } catch { /* Storage may be blocked. */ }
}
export function getSessionToken(): string | null {
  try { memoryToken = sessionStorage.getItem(TOKEN_KEY) || memoryToken; } catch { /* Use in-memory session. */ }
  if (memoryToken && !isTokenCurrent(memoryToken)) clearSession();
  return memoryToken;
}
export function setSessionToken(token: string) {
  if (!isTokenCurrent(token)) throw new Error('The server returned an invalid or expired session.');
  memoryToken = token;
  try { sessionStorage.setItem(TOKEN_KEY, token); localStorage.removeItem(TOKEN_KEY); } catch { /* Use in-memory session. */ }
}
