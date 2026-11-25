import axiosClient from '@/services/api/axiosClient'
import { ENDPOINTS } from '@/services/api/endpoints'
import { API_URL } from '@/constants/config'
import { ROLES, normalizeRole } from '@/constants/roles'

/** Backend user -> frontend user (adds `role` for the UI, keeps `backendRole`). */
export function normalizeUser(raw) {
  if (!raw) return null
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    name: [raw.firstName, raw.lastName].filter(Boolean).join(' ') || raw.email,
    phone: raw.phone ?? '',
    companyName: raw.companyName ?? null,
    agencyStatus: raw.agencyStatus ?? null,
    role: normalizeRole(raw.role) ?? ROLES.GUEST,
    backendRole: raw.role,
    permissions: raw.permissions ?? [],
  }
}

/** Expected backend contract is documented in README_AUTH.md */
const api = {
  async login(credentials) {
    const { data } = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, credentials)
    return data // { token, user }
  },
  async registerCustomer(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.AUTH.REGISTER_CUSTOMER, payload)
    return data // { token, user }
  },
  async registerAgency(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.AUTH.REGISTER_AGENCY, payload)
    return data // { message }
  },
  async me() {
    const { data } = await axiosClient.get(ENDPOINTS.AUTH.ME)
    return data
  },
  async logout() {
    try { await axiosClient.post(ENDPOINTS.AUTH.LOGOUT) } catch { /* token is cleared anyway */ }
  },
  async forgotPassword(email) {
    await axiosClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  },
  async resetPassword(payload) {
    await axiosClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload)
  },
}

const authService = {
  async login(credentials) {
    const { token, user } = await api.login(credentials)
    return { token, user: normalizeUser(user) }
  },
  async registerCustomer(payload) {
    const { token, user } = await api.registerCustomer(payload)
    return { token, user: normalizeUser(user) }
  },
  registerAgency: (payload) => api.registerAgency(payload),
  async me() {
    return normalizeUser(await api.me())
  },
  logout: () => api.logout(),
  forgotPassword: (email) => api.forgotPassword(email),
  resetPassword: (payload) => api.resetPassword(payload),

  /** Google OAuth: the backend owns the flow, we only start it. */
  googleLoginUrl: () => `${API_URL}${ENDPOINTS.AUTH.GOOGLE}`,
}

export default authService
