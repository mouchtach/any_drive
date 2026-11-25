import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import authService from '../services/authService'
import { ROUTES } from '@/constants/routes'
import { PASSWORD_RULES, validatePassword } from '@/utils/validators'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const pwdError = validatePassword(password)
    if (pwdError) return setError(pwdError)
    if (password !== confirm) return setError('Passwords do not match.')
    setError('')
    setLoading(true)
    try {
      await authService.resetPassword({ token, password })
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (err) {
      setError(err.userMessage || 'This link is invalid or expired.')
      setLoading(false)
    }
  }

  return (
    <div className="card w-full max-w-md p-6 md:p-8">
      <h1 className="text-2xl">Set a new password</h1>
      {!token ? (
        <p role="alert" className="mt-4 text-sm text-red-600">This reset link is invalid. <Link className="font-semibold underline" to={ROUTES.FORGOT_PASSWORD}>Request a new one</Link>.</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-5">
          <Input label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint={PASSWORD_RULES} />
          <Input label="Confirm password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={error} />
          <Button type="submit" variant="cta" fullWidth loading={loading}>Save password</Button>
        </form>
      )}
    </div>
  )
}
