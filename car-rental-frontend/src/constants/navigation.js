import { ROLES } from './roles'
import { ROUTES } from './routes'

/**
 * Navbar links per role. `primary` is always visible on desktop,
 * `more` goes in the "More" dropdown. `end: true` = exact match for active state.
 */
const NAV = {
  [ROLES.GUEST]: {
    primary: [
      { label: 'Home', to: ROUTES.HOME, end: true },
      { label: 'Cars', to: ROUTES.CARS },
      { label: 'About', to: ROUTES.ABOUT },
      { label: 'Contact', to: ROUTES.CONTACT },
    ],
    more: [],
    menu: [],
  },
  [ROLES.CUSTOMER]: {
    primary: [
      { label: 'Home', to: ROUTES.HOME, end: true },
      { label: 'Cars', to: ROUTES.CARS },
      { label: 'Dashboard', to: ROUTES.CUSTOMER.ROOT, end: true },
      { label: 'My Bookings', to: ROUTES.CUSTOMER.BOOKINGS },
      { label: 'Favorites', to: ROUTES.CUSTOMER.FAVORITES },
    ],
    more: [
      { label: 'Payments', to: ROUTES.CUSTOMER.PAYMENTS },
      { label: 'My Reviews', to: ROUTES.CUSTOMER.REVIEWS },
    ],
    menu: [
      { label: 'Dashboard', to: ROUTES.CUSTOMER.ROOT },
      { label: 'My Profile', to: ROUTES.CUSTOMER.PROFILE },
    ],
  },
  [ROLES.AGENCY]: {
    primary: [
      { label: 'Dashboard', to: ROUTES.AGENCY.ROOT, end: true },
      { label: 'Fleet', to: ROUTES.AGENCY.FLEET },
      { label: 'Bookings', to: ROUTES.AGENCY.BOOKINGS },
      { label: 'Calendar', to: ROUTES.AGENCY.CALENDAR },
    ],
    more: [
      { label: 'Earnings', to: ROUTES.AGENCY.EARNINGS },
      { label: 'Reviews', to: ROUTES.AGENCY.REVIEWS },
      { label: 'Agency Profile', to: ROUTES.AGENCY.PROFILE },
    ],
    menu: [
      { label: 'Dashboard', to: ROUTES.AGENCY.ROOT },
      { label: 'Agency Profile', to: ROUTES.AGENCY.PROFILE },
    ],
  },
  [ROLES.ADMIN]: {
    primary: [
      { label: 'Dashboard', to: ROUTES.ADMIN.ROOT, end: true },
      { label: 'Users', to: ROUTES.ADMIN.USERS },
      { label: 'Agencies', to: ROUTES.ADMIN.AGENCIES },
      { label: 'Approvals', to: ROUTES.ADMIN.APPROVALS },
    ],
    more: [
      { label: 'Cars', to: ROUTES.ADMIN.CARS },
      { label: 'Bookings', to: ROUTES.ADMIN.BOOKINGS },
      { label: 'Payments', to: ROUTES.ADMIN.PAYMENTS },
      { label: 'Reports', to: ROUTES.ADMIN.REPORTS },
      { label: 'Reviews', to: ROUTES.ADMIN.REVIEWS },
      { label: 'Settings', to: ROUTES.ADMIN.SETTINGS },
    ],
    menu: [
      { label: 'Dashboard', to: ROUTES.ADMIN.ROOT },
      { label: 'Settings', to: ROUTES.ADMIN.SETTINGS },
    ],
  },
}

export function navFor(role) {
  return NAV[role] ?? NAV[ROLES.GUEST]
}

/** "Account" column of the footer, per role. */
export const FOOTER_ACCOUNT = {
  [ROLES.GUEST]: [
    { label: 'Login', to: ROUTES.LOGIN },
    { label: 'Create an account', to: ROUTES.REGISTER_CUSTOMER },
    { label: 'Become a partner agency', to: ROUTES.REGISTER_AGENCY },
  ],
  [ROLES.CUSTOMER]: [
    { label: 'My bookings', to: ROUTES.CUSTOMER.BOOKINGS },
    { label: 'Favorites', to: ROUTES.CUSTOMER.FAVORITES },
    { label: 'My profile', to: ROUTES.CUSTOMER.PROFILE },
  ],
  [ROLES.AGENCY]: [
    { label: 'Fleet', to: ROUTES.AGENCY.FLEET },
    { label: 'Booking requests', to: ROUTES.AGENCY.BOOKINGS },
    { label: 'Agency profile', to: ROUTES.AGENCY.PROFILE },
  ],
  [ROLES.ADMIN]: [
    { label: 'Users', to: ROUTES.ADMIN.USERS },
    { label: 'Agency approvals', to: ROUTES.ADMIN.APPROVALS },
    { label: 'Settings', to: ROUTES.ADMIN.SETTINGS },
  ],
}
