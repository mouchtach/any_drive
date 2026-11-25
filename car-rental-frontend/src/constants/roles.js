/** Roles used by the frontend (what the UI cares about). */
export const ROLES = Object.freeze({
  GUEST: 'guest',
  CUSTOMER: 'customer',
  AGENCY: 'agency',
  ADMIN: 'admin',
})

export const ROLE_LABELS = Object.freeze({
  [ROLES.GUEST]: 'Guest',
  [ROLES.CUSTOMER]: 'Customer',
  [ROLES.AGENCY]: 'Agency',
  [ROLES.ADMIN]: 'Admin',
})

/**
 * The backend may use finer-grained roles (employee / manager / agency admin /
 * super admin). The UI groups them in the 4 areas above. The original backend
 * role is kept in `user.backendRole` for fine-grained checks.
 */
const BACKEND_ROLE_MAP = Object.freeze({
  CUSTOMER: ROLES.CUSTOMER,
  AGENCY: ROLES.AGENCY,
  AGENCY_EMPLOYEE: ROLES.AGENCY,
  AGENCY_MANAGER: ROLES.AGENCY,
  AGENCY_ADMIN: ROLES.AGENCY,
  ADMIN: ROLES.ADMIN,
  SUPER_ADMIN: ROLES.ADMIN,
})

export function normalizeRole(backendRole) {
  if (!backendRole) return ROLES.GUEST
  return BACKEND_ROLE_MAP[String(backendRole).toUpperCase()] ?? ROLES.GUEST
}
