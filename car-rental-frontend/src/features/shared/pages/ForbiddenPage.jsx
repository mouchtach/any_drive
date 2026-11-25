import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import useAuth from '@/features/auth/hooks/useAuth'
import { ROLE_LABELS } from '@/constants/roles'
import { ROUTES, roleHome } from '@/constants/routes'

export default function ForbiddenPage() {
  const { role, isAuthenticated } = useAuth()
  return (
    <section className="container-page py-20 text-center">
      <ShieldAlert className="mx-auto text-accent-500" size={56} aria-hidden="true" />
      <p className="mt-4 text-6xl font-extrabold text-primary-600">403</p>
      <h1 className="mt-4 text-3xl">Access denied</h1>
      <p className="mt-2 text-muted">
        {isAuthenticated
          ? `Your role (${ROLE_LABELS[role]}) is not allowed to open this page.`
          : 'You need to log in to open this page.'}
      </p>
      <Link to={isAuthenticated ? roleHome(role) : ROUTES.LOGIN} className="btn-primary mt-8">
        {isAuthenticated ? 'Go to my space' : 'Log in'}
      </Link>
    </section>
  )
}
