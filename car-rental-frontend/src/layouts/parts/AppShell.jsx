import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { cn } from '@/utils/cn'

/**
 * Shared page shell: Navbar + page content + Footer.
 * Every layout uses it; the Navbar adapts itself to the logged-in role.
 */
export default function AppShell({ area, centered = false }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      {area && (
        <div className="border-b border-line bg-primary-50">
          <p className="container-page py-2 text-xs font-semibold uppercase tracking-widest text-primary-600">{area}</p>
        </div>
      )}
      <main id="main" className={cn('flex-1', centered && 'flex items-center justify-center px-4 py-10')}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
