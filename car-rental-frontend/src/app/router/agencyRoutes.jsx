import { Route } from 'react-router-dom'
import AgencyLayout from '@/layouts/AgencyLayout'
import ProtectedRoute from './guards/ProtectedRoute'
import RoleRoute from './guards/RoleRoute'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

import AgencyDashboardPage from '@/features/agency/pages/AgencyDashboardPage'
import FleetPage from '@/features/agency/pages/FleetPage'
import AddCarPage from '@/features/agency/pages/AddCarPage'
import EditCarPage from '@/features/agency/pages/EditCarPage'
import AgencyBookingsPage from '@/features/agency/pages/AgencyBookingsPage'
import AgencyBookingDetailsPage from '@/features/agency/pages/AgencyBookingDetailsPage'
import AgencyCalendarPage from '@/features/agency/pages/AgencyCalendarPage'
import AgencyEarningsPage from '@/features/agency/pages/AgencyEarningsPage'
import AgencyReviewsPage from '@/features/agency/pages/AgencyReviewsPage'
import AgencyProfilePage from '@/features/agency/pages/AgencyProfilePage'

const A = ROUTES.AGENCY

/** Logged in + role AGENCY. Fine-grained example: adding/editing cars needs "fleet:manage". */
export const agencyRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowed={[ROLES.AGENCY]} />}>
      <Route element={<AgencyLayout />}>
        <Route path={A.ROOT} element={<AgencyDashboardPage />} />
        <Route path={A.FLEET} element={<FleetPage />} />
        <Route element={<RoleRoute allowed={[ROLES.AGENCY]} permission="fleet:manage" />}>
          <Route path={A.ADD_CAR} element={<AddCarPage />} />
          <Route path={A.EDIT_CAR} element={<EditCarPage />} />
        </Route>
        <Route path={A.BOOKINGS} element={<AgencyBookingsPage />} />
        <Route path={A.BOOKING_DETAILS} element={<AgencyBookingDetailsPage />} />
        <Route path={A.CALENDAR} element={<AgencyCalendarPage />} />
        <Route path={A.EARNINGS} element={<AgencyEarningsPage />} />
        <Route path={A.REVIEWS} element={<AgencyReviewsPage />} />
        <Route path={A.PROFILE} element={<AgencyProfilePage />} />
      </Route>
    </Route>
  </Route>
)
