import { Route, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import GuestOnlyRoute from './guards/GuestOnlyRoute'
import { ROUTES } from '@/constants/routes'

import HomePage from '@/features/home/pages/HomePage'
import CarListPage from '@/features/cars/pages/CarListPage'
import CarDetailsPage from '@/features/cars/pages/CarDetailsPage'
import AboutPage from '@/features/shared/pages/AboutPage'
import ContactPage from '@/features/shared/pages/ContactPage'
import ForbiddenPage from '@/features/shared/pages/ForbiddenPage'
import ServerErrorPage from '@/features/shared/pages/ServerErrorPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterCustomerPage from '@/features/auth/pages/RegisterCustomerPage'
import RegisterAgencyPage from '@/features/auth/pages/RegisterAgencyPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import OAuthCallbackPage from '@/features/auth/pages/OAuthCallbackPage'

/** Guests AND logged-in users can open these. */
export const publicRoutes = (
  <>
    <Route element={<PublicLayout />}>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.CARS} element={<CarListPage />} />
      <Route path={ROUTES.CAR_DETAILS} element={<CarDetailsPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
      <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
    </Route>

    {/* Login & register: guests only (logged-in users are redirected to their dashboard) */}
    <Route element={<GuestOnlyRoute />}>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<Navigate to={ROUTES.REGISTER_CUSTOMER} replace />} />
        <Route path={ROUTES.REGISTER_CUSTOMER} element={<RegisterCustomerPage />} />
        <Route path={ROUTES.REGISTER_AGENCY} element={<RegisterAgencyPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>
    </Route>

    {/* OAuth return page: must stay reachable while the user is still a guest */}
    <Route element={<AuthLayout />}>
      <Route path={ROUTES.OAUTH_CALLBACK} element={<OAuthCallbackPage />} />
    </Route>
  </>
)
