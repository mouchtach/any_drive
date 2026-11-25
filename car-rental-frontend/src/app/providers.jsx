import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/store/AuthContext'

/** All global providers in one place. */
export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  )
}
