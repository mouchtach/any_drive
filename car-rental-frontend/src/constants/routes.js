import { ROLES } from './roles'

/** Every URL of the app lives here. Never type a path by hand. */
export const ROUTES = Object.freeze({
  // public
  HOME: '/',
  CARS: '/cars',
  CAR_DETAILS: '/cars/:id',
  carDetails: (id) => `/cars/${id}`,
  ABOUT: '/about',
  CONTACT: '/contact',

  // auth (guest only)
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_CUSTOMER: '/register/customer',
  REGISTER_AGENCY: '/register/agency',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  OAUTH_CALLBACK: '/auth/callback',

  // errors
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',

  // customer
  CUSTOMER: {
    ROOT: '/customer',
    BOOKINGS: '/customer/bookings',
    BOOKING_DETAILS: '/customer/bookings/:id',
    bookingDetails: (id) => `/customer/bookings/${id}`,
    FAVORITES: '/customer/favorites',
    PAYMENTS: '/customer/payments',
    PROFILE: '/customer/profile',
    REVIEWS: '/customer/reviews',
    CHECKOUT: '/customer/checkout',
    BOOKING_CONFIRMATION: '/customer/booking-confirmation',
  },

  // agency
  AGENCY: {
    ROOT: '/agency',
    FLEET: '/agency/fleet',
    ADD_CAR: '/agency/fleet/new',
    EDIT_CAR: '/agency/fleet/:id/edit',
    BOOKINGS: '/agency/bookings',
    BOOKING_DETAILS: '/agency/bookings/:id',
    CALENDAR: '/agency/calendar',
    EARNINGS: '/agency/earnings',
    REVIEWS: '/agency/reviews',
    PROFILE: '/agency/profile',
  },

  // admin
  ADMIN: {
    ROOT: '/admin',
    USERS: '/admin/users',
    AGENCIES: '/admin/agencies',
    APPROVALS: '/admin/approvals',
    CARS: '/admin/cars',
    BOOKINGS: '/admin/bookings',
    PAYMENTS: '/admin/payments',
    REPORTS: '/admin/reports',
    REVIEWS: '/admin/reviews',
    SETTINGS: '/admin/settings',
  },
})

/** Where each role lands after login. */
export function roleHome(role) {
  switch (role) {
    case ROLES.CUSTOMER: return ROUTES.CUSTOMER.ROOT
    case ROLES.AGENCY: return ROUTES.AGENCY.ROOT
    case ROLES.ADMIN: return ROUTES.ADMIN.ROOT
    default: return ROUTES.HOME
  }
}

const AREA_PREFIX = [
  [ROUTES.CUSTOMER.ROOT, ROLES.CUSTOMER],
  [ROUTES.AGENCY.ROOT, ROLES.AGENCY],
  [ROUTES.ADMIN.ROOT, ROLES.ADMIN],
]

/**
 * UX helper: can this role open this path? Used to decide if we can send the
 * user back to the page they wanted after login. (Real protection = backend.)
 */
export function canAccessPath(role, path = '/') {
  for (const [prefix, owner] of AREA_PREFIX) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return role === owner
  }
  return true
}

/**
 * Where to send a user right after login: the page they originally asked for
 * (`from`, set by ProtectedRoute) if their role may open it, else their dashboard.
 */
export function postLoginPath(role, from) {
  if (from?.pathname && canAccessPath(role, from.pathname)) {
    return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
  }
  return roleHome(role)
}
