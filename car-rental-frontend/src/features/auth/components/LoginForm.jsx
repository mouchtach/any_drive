import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import useAuth from '../hooks/useAuth'
import authService from '../services/authService'
import { ROUTES, postLoginPath } from '@/constants/routes'
import { isEmail } from '@/utils/validators'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  /** Same rule as GuestOnlyRoute: wanted page if allowed, else the role dashboard. */
  const redirectAfterLogin = (user) =>
    navigate(postLoginPath(user.role, location.state?.from), { replace: true })

  const validate = () => {
    const next = {}
    if (!isEmail(values.email)) next.email = 'Enter a valid email address.'
    if (!values.password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      redirectAfterLogin(await login({ email: values.email.trim(), password: values.password }))
    } catch (err) {
      setServerError(err.userMessage || err.message)
      setLoading(false)
    }
  }

  /** The backend owns the OAuth flow: we only send the browser to it. */
  const handleGoogle = () => {
    window.location.assign(authService.googleLoginUrl())
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {serverError}
        </div>
      )}

      <Input label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={onChange} error={errors.email} />

      <Input
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="••••••••"
        value={values.password}
        onChange={onChange}
        error={errors.password}
        rightSlot={
          <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="rounded-lg p-2 text-muted hover:text-primary-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      <div className="text-right">
        <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</Link>
      </div>

      <Button type="submit" variant="cta" fullWidth loading={loading}>Log in</Button>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>

      <Button variant="outline" fullWidth onClick={handleGoogle} disabled={loading}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.500c3.540 0 6.710 1.220 9.210 3.600l6.850-6.850C35.900 2.380 30.470 0 24 0 14.620 0 6.510 5.380 2.560 13.220l7.980 6.190C12.430 13.720 17.740 9.500 24 9.500z" />
          <path fill="#4285F4" d="M46.980 24.550c0-1.570-.15-3.090-.38-4.550H24v9.020h12.940c-.58 2.960-2.260 5.480-4.780 7.180l7.730 6c4.510-4.180 7.090-10.360 7.090-17.650z" />
          <path fill="#FBBC05" d="M10.530 28.590c-.48-1.450-.76-2.990-.76-4.590s.27-3.140.76-4.590l-7.980-6.190C.92 16.460 0 20.120 0 24c0 3.880.92 7.540 2.560 10.780l7.970-6.190z" />
          <path fill="#34A853" d="M24 48c6.480 0 11.930-2.130 15.890-5.810l-7.730-6c-2.150 1.450-4.920 2.300-8.160 2.300-6.260 0-11.570-4.220-13.470-9.910l-7.980 6.190C6.510 42.620 14.620 48 24 48z" />
        </svg>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted">
        New to AnyDrive?{' '}
        <Link to={ROUTES.REGISTER_CUSTOMER} className="font-semibold text-primary-600 hover:underline">Create an account</Link>
      </p>

    </form>
  )
}
