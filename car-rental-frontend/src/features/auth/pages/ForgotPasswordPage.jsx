import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import authService from '../services/authService'
import { ROUTES } from '@/constants/routes'
import { isEmail } from '@/utils/validators'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setError('Enter a valid email address.')
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email.trim())
    } catch {
      /* same message either way: never reveal if an email exists */
    }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="card w-full max-w-md p-6 md:p-8">
      <h1 className="text-2xl">Forgot password</h1>
      {sent ? (
        <p role="status" className="mt-4 text-sm text-muted">
          If an account exists for <strong>{email}</strong>, you will receive a reset link shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-5">
          <p className="text-sm text-muted">Enter your email and we will send you a reset link.</p>
          <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" variant="cta" fullWidth loading={loading}>Send reset link</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary-600 hover:underline">Back to login</Link>
      </p>
    </div>
  )
}
