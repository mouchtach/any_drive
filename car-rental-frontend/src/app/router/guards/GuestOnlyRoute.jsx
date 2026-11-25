import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '@/features/auth/hooks/useAuth'
import Spinner from '@/components/ui/Spinner'
import { postLoginPath } from '@/constants/routes'

/**
 * Login / register pages: logged-in users are sent away (to the page they
 * wanted before logging in, or to their own dashboard).
 */
export default function GuestOnlyRoute() {
  const { isAuthenticated, isLoading, role } = useAuth()
  const location = useLocation()

  if (isLoading) return <Spinner fullPage />
  if (isAuthenticated) return <Navigate to={postLoginPath(role, location.state?.from)} replace />
  return <Outlet />
}
