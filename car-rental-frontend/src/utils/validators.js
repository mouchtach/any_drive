const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[0-9 ()-]{8,18}$/

export const isEmail = (v = '') => EMAIL_RE.test(v.trim())
export const isPhone = (v = '') => PHONE_RE.test(v.trim())

export const PASSWORD_RULES = 'At least 8 characters with an uppercase letter, a lowercase letter and a number.'

/** Returns an error message, or '' when the password is valid. */
export function validatePassword(v = '') {
  if (v.length < 8) return 'Password must be at least 8 characters.'
  if (!/[a-z]/.test(v)) return 'Password needs a lowercase letter.'
  if (!/[A-Z]/.test(v)) return 'Password needs an uppercase letter.'
  if (!/[0-9]/.test(v)) return 'Password needs a number.'
  return ''
}
