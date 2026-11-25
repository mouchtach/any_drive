import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { PASSWORD_RULES, isEmail, isPhone, validatePassword } from '@/utils/validators'

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  companyName: '', licenseNumber: '', address: '',
}

/**
 * Reusable sign-up form. variant="customer" | "agency" (agency adds company fields).
 * `onSubmit(values)` may throw; the message is shown above the form.
 */
export default function RegisterForm({ variant = 'customer', onSubmit, submitLabel = 'Create account' }) {
  const isAgency = variant === 'agency'
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!values.firstName.trim()) e.firstName = 'First name is required.'
    if (!values.lastName.trim()) e.lastName = 'Last name is required.'
    if (!isEmail(values.email)) e.email = 'Enter a valid email address.'
    if (values.phone && !isPhone(values.phone)) e.phone = 'Enter a valid phone number.'
    const pwd = validatePassword(values.password)
    if (pwd) e.password = pwd
    if (values.confirmPassword !== values.password) e.confirmPassword = 'Passwords do not match.'
    if (isAgency) {
      if (!values.companyName.trim()) e.companyName = 'Company name is required.'
      if (!values.licenseNumber.trim()) e.licenseNumber = 'License number is required.'
      if (!values.address.trim()) e.address = 'Address is required.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      // confirmPassword is a UI-only field: never sent to the API
      const { confirmPassword: _c, ...payload } = values
      if (!isAgency) {
        delete payload.companyName
        delete payload.licenseNumber
        delete payload.address
      }
      await onSubmit(payload)
    } catch (err) {
      setServerError(err.userMessage || err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" name="firstName" autoComplete="given-name" value={values.firstName} onChange={onChange} error={errors.firstName} />
        <Input label="Last name" name="lastName" autoComplete="family-name" value={values.lastName} onChange={onChange} error={errors.lastName} />
      </div>

      <Input label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange} error={errors.email} />
      <Input label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={onChange} error={errors.phone} />

      {isAgency && (
        <>
          <Input label="Company name" name="companyName" value={values.companyName} onChange={onChange} error={errors.companyName} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="License number" name="licenseNumber" value={values.licenseNumber} onChange={onChange} error={errors.licenseNumber} />
            <Input label="Address" name="address" autoComplete="street-address" value={values.address} onChange={onChange} error={errors.address} />
          </div>
        </>
      )}

      <Input label="Password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={onChange} error={errors.password} hint={PASSWORD_RULES} />
      <Input label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={onChange} error={errors.confirmPassword} />

      <Button type="submit" variant="cta" fullWidth loading={loading}>{submitLabel}</Button>
    </form>
  )
}
