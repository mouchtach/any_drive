import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="card w-full max-w-md p-6 md:p-8">
      <h1 className="text-2xl">Welcome back</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Log in as customer, agency or admin — we send you to the right place.</p>
      <LoginForm />
    </div>
  )
}
