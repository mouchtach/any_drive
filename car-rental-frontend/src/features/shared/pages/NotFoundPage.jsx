import { Link } from 'react-router-dom'
import useAuth from '@/features/auth/hooks/useAuth'
import { roleHome } from '@/constants/routes'

export default function NotFoundPage() {
  const { role } = useAuth()
  return (
    <section className="container-page py-20 text-center">
      <p className="text-6xl font-extrabold text-accent-500">404</p>
      <h1 className="mt-4 text-3xl">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist.</p>
      <Link to={roleHome(role)} className="btn-primary mt-8">Go back home</Link>
    </section>
  )
}
