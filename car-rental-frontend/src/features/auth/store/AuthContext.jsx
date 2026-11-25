import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import authService from '../services/authService'
import tokenStorage from '../utils/tokenStorage'
import { ROLES } from '@/constants/roles'
import { AUTH_UNAUTHORIZED_EVENT } from '@/services/api/interceptors'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // true while we restore the session

  // Restore the session on page load / refresh
  useEffect(() => {
    let cancelled = false
    const token = tokenStorage.get()
    if (!token) {
      setIsLoading(false)
      return undefined
    }
    authService
      .me()
      .then((u) => { if (!cancelled) setUser(u) })
      .catch(() => { tokenStorage.clear() })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  // The axios interceptor tells us when the backend answered 401
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const startSession = useCallback(({ token, user: u }) => {
    tokenStorage.set(token)
    setUser(u)
    return u
  }, [])

  const login = useCallback(async (credentials) => startSession(await authService.login(credentials)), [startSession])
  const registerCustomer = useCallback(async (data) => startSession(await authService.registerCustomer(data)), [startSession])
  const registerAgency = useCallback((data) => authService.registerAgency(data), [])

  /** Used by the OAuth callback page: we received a token, now load the user. */
  const loginWithToken = useCallback(async (token) => {
    tokenStorage.set(token)
    try {
      const u = await authService.me()
      setUser(u)
      return u
    } catch (err) {
      tokenStorage.clear()
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    tokenStorage.clear()
    setUser(null)
  }, [])

  /** Fine-grained check, e.g. can('fleet:manage'). '*' = everything. */
  const can = useCallback(
    (permission) => !!user && (user.permissions.includes('*') || user.permissions.includes(permission)),
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? ROLES.GUEST,
      isAuthenticated: !!user,
      isLoading,
      login,
      registerCustomer,
      registerAgency,
      loginWithToken,
      logout,
      can,
    }),
    [user, isLoading, login, registerCustomer, registerAgency, loginWithToken, logout, can],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
