import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import RegisterForm from '../components/RegisterForm'
import useAuth from '../hooks/useAuth'
import { ROUTES } from '@/constants/routes'

export default function RegisterAgencyPage() {
  const { registerAgency } = useAuth()
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="card w-full max-w-lg p-8 text-center">
        <CheckCircle2 className="mx-auto text-green-600" size={48} aria-hidden="true" />
        <h1 className="mt-4 text-2xl">Request received</h1>
        <p className="mt-2 text-sm text-muted">
          An admin will review your agency. You will be able to log in once it is approved.
        </p>
        <Link to={ROUTES.HOME} className="btn-primary mt-6">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="card w-full max-w-lg p-6 md:p-8">
      <h1 className="text-2xl">Register your agency</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Agency accounts need admin approval before first login.{' '}
        <Link to={ROUTES.REGISTER_CUSTOMER} className="font-semibold text-primary-600 hover:underline">I’m a customer</Link>
      </p>
      <RegisterForm
        variant="agency"
        submitLabel="Submit for approval"
        onSubmit={async (values) => {
          await registerAgency(values)
          setDone(true)
        }}
      />
    </div>
  )
}
