import { useContext } from 'react'
import { AuthContext } from '../store/AuthContext'

/** const { user, role, isAuthenticated, login, logout, can } = useAuth() */
export default function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
