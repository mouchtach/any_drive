import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/constants/routes'

/**
 * Only the listed roles can pass. Optional `permission` adds a fine-grained check.
 * Use it INSIDE <ProtectedRoute/>.
 *   <RoleRoute allowed={[ROLES.AGENCY]} permission="fleet:manage" />
 */
export default function RoleRoute({ allowed, permission }) {
  const { role, can } = useAuth()
  const roleOk = allowed.includes(role)
  const permissionOk = !permission || can(permission)

  if (!roleOk || !permissionOk) return <Navigate to={ROUTES.FORBIDDEN} replace />
  return <Outlet />
}
