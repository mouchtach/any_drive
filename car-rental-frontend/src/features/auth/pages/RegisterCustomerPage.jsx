import { Link, useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'
import useAuth from '../hooks/useAuth'
import { ROUTES, roleHome } from '@/constants/routes'

export default function RegisterCustomerPage() {
  const { registerCustomer } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    const user = await registerCustomer(values)
    navigate(roleHome(user.role), { replace: true })
  }

  return (
    <div className="card w-full max-w-lg p-6 md:p-8">
      <h1 className="text-2xl">Create your account</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Book cars in minutes. Already registered?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary-600 hover:underline">Log in</Link>
      </p>
      <RegisterForm variant="customer" onSubmit={handleSubmit} />
      <p className="mt-6 text-center text-sm text-muted">
        Own a rental agency?{' '}
        <Link to={ROUTES.REGISTER_AGENCY} className="font-semibold text-primary-600 hover:underline">Register as an agency</Link>
      </p>
    </div>
  )
}
