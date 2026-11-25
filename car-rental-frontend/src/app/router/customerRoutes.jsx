import { Route } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import ProtectedRoute from './guards/ProtectedRoute'
import RoleRoute from './guards/RoleRoute'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

import CustomerDashboardPage from '@/features/customer/pages/CustomerDashboardPage'
import MyBookingsPage from '@/features/customer/pages/MyBookingsPage'
import BookingDetailsPage from '@/features/customer/pages/BookingDetailsPage'
import FavoritesPage from '@/features/customer/pages/FavoritesPage'
import PaymentHistoryPage from '@/features/customer/pages/PaymentHistoryPage'
import CustomerProfilePage from '@/features/customer/pages/CustomerProfilePage'
import CustomerReviewsPage from '@/features/customer/pages/CustomerReviewsPage'
import CheckoutPage from '@/features/bookings/pages/CheckoutPage'
import BookingConfirmationPage from '@/features/bookings/pages/BookingConfirmationPage'

const C = ROUTES.CUSTOMER

/** Logged in + role CUSTOMER. */
export const customerRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowed={[ROLES.CUSTOMER]} />}>
      <Route element={<CustomerLayout />}>
        <Route path={C.ROOT} element={<CustomerDashboardPage />} />
        <Route path={C.BOOKINGS} element={<MyBookingsPage />} />
        <Route path={C.BOOKING_DETAILS} element={<BookingDetailsPage />} />
        <Route path={C.FAVORITES} element={<FavoritesPage />} />
        <Route path={C.PAYMENTS} element={<PaymentHistoryPage />} />
        <Route path={C.PROFILE} element={<CustomerProfilePage />} />
        <Route path={C.REVIEWS} element={<CustomerReviewsPage />} />
        <Route path={C.CHECKOUT} element={<CheckoutPage />} />
        <Route path={C.BOOKING_CONFIRMATION} element={<BookingConfirmationPage />} />
      </Route>
    </Route>
  </Route>
)
