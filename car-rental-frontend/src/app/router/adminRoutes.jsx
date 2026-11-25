import { Route } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from './guards/ProtectedRoute'
import RoleRoute from './guards/RoleRoute'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage'
import UsersManagementPage from '@/features/admin/pages/UsersManagementPage'
import AgenciesManagementPage from '@/features/admin/pages/AgenciesManagementPage'
import AgencyApprovalPage from '@/features/admin/pages/AgencyApprovalPage'
import CarsModerationPage from '@/features/admin/pages/CarsModerationPage'
import AllBookingsPage from '@/features/admin/pages/AllBookingsPage'
import PaymentsPage from '@/features/admin/pages/PaymentsPage'
import ReportsPage from '@/features/admin/pages/ReportsPage'
import ReviewsModerationPage from '@/features/admin/pages/ReviewsModerationPage'
import SettingsPage from '@/features/admin/pages/SettingsPage'

const D = ROUTES.ADMIN

/** Logged in + role ADMIN. */
export const adminRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowed={[ROLES.ADMIN]} />}>
      <Route element={<AdminLayout />}>
        <Route path={D.ROOT} element={<AdminDashboardPage />} />
        <Route path={D.USERS} element={<UsersManagementPage />} />
        <Route path={D.AGENCIES} element={<AgenciesManagementPage />} />
        <Route path={D.APPROVALS} element={<AgencyApprovalPage />} />
        <Route path={D.CARS} element={<CarsModerationPage />} />
        <Route path={D.BOOKINGS} element={<AllBookingsPage />} />
        <Route path={D.PAYMENTS} element={<PaymentsPage />} />
        <Route path={D.REPORTS} element={<ReportsPage />} />
        <Route path={D.REVIEWS} element={<ReviewsModerationPage />} />
        <Route path={D.SETTINGS} element={<SettingsPage />} />
      </Route>
    </Route>
  </Route>
)
