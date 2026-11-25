import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '@/features/auth/hooks/useAuth'
import Spinner from '@/components/ui/Spinner'
import { ROUTES } from '@/constants/routes'

/** Must be logged in. Otherwise -> /login (remembering where the user wanted to go). */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <Spinner fullPage />
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  return <Outlet />
}
