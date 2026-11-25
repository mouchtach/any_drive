import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import useAuth from '../hooks/useAuth'
import { ROUTES, roleHome } from '@/constants/routes'

/**
 * The backend redirects here after Google login:  /auth/callback#token=<jwt>
 * The token is in the URL *fragment* (#), which browsers never send to servers.
 * We read it, wipe it from the address bar, and load the user.
 */
export default function OAuthCallbackPage() {
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const ran = useRef(false) // StrictMode runs effects twice in dev

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token')
    window.history.replaceState(null, '', window.location.pathname)
    if (!token) {
      setError('Login with Google failed. Please try again.')
      return
    }
    loginWithToken(token)
      .then((user) => navigate(roleHome(user.role), { replace: true }))
      .catch(() => setError('Login with Google failed. Please try again.'))
  }, [loginWithToken, navigate])

  return (
    <div className="card w-full max-w-md p-8 text-center">
      {error ? (
        <>
          <p role="alert" className="text-sm font-medium text-red-600">{error}</p>
          <Link to={ROUTES.LOGIN} className="btn-primary mt-6">Back to login</Link>
        </>
      ) : (
        <>
          <Spinner className="mx-auto" label="Signing you in" />
          <p className="mt-4 text-sm text-muted">Signing you in…</p>
        </>
      )}
    </div>
  )
}
