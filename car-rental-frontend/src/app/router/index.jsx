import { Route, Routes } from 'react-router-dom'
import ScrollToTop from '@/components/common/ScrollToTop'
import PublicLayout from '@/layouts/PublicLayout'
import NotFoundPage from '@/features/shared/pages/NotFoundPage'
import { publicRoutes } from './publicRoutes'
import { customerRoutes } from './customerRoutes'
import { agencyRoutes } from './agencyRoutes'
import { adminRoutes } from './adminRoutes'

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {publicRoutes}
        {customerRoutes}
        {agencyRoutes}
        {adminRoutes}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
