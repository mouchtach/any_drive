const KEY = 'anydrive_token'

/**
 * Stores the JWT in localStorage (wrapped in try/catch: storage can be blocked).
 * Trade-off documented in README_AUTH.md (httpOnly cookie is the safer option).
 */
const tokenStorage = {
  get() {
    try { return localStorage.getItem(KEY) } catch { return null }
  },
  set(token) {
    try { localStorage.setItem(KEY, token) } catch { /* ignore */ }
  },
  clear() {
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  },
}

export default tokenStorage
