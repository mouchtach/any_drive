import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, X } from 'lucide-react'
import Logo from '@/components/common/Logo'
import Badge from '@/components/ui/Badge'
import useAuth from '@/features/auth/hooks/useAuth'
import useClickOutside from '@/hooks/useClickOutside'
import { navFor } from '@/constants/navigation'
import { ROLES, ROLE_LABELS } from '@/constants/roles'
import { ROUTES, roleHome } from '@/constants/routes'
import { cn } from '@/utils/cn'

const linkClass = ({ isActive }) =>
  cn(
    'relative px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'text-primary-700 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent-500'
      : 'text-primary-900/80 hover:text-primary-600',
  )

const mobileLinkClass = ({ isActive }) =>
  cn(
    'block rounded-xl px-4 py-3 text-sm font-medium',
    isActive ? 'bg-accent-50 text-primary-700' : 'text-primary-900 hover:bg-primary-50',
  )

/** Small dropdown: a trigger button + a floating panel. Closes on outside click / Escape. */
function Dropdown({ trigger, children, align = 'left', label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  const { pathname } = useLocation()

  useClickOutside(ref, close)
  useEffect(() => { close() }, [pathname, close])

  return (
    <div
      ref={ref}
      className="relative"
      onKeyDown={(e) => e.key === 'Escape' && close()}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-primary-900/80 transition-colors hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100"
      >
        {trigger}
        <ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 mt-2 min-w-[14rem] rounded-2xl border border-line bg-white p-2 shadow-lift',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function MenuLink({ to, children }) {
  return (
    <NavLink
      to={to}
      role="menuitem"
      className={({ isActive }) =>
        cn('block rounded-xl px-3 py-2 text-sm font-medium', isActive ? 'bg-accent-50 text-primary-700' : 'text-primary-900 hover:bg-primary-50')
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { primary, more, menu } = navFor(role)
  const initials = user ? `${user.firstName?.[0] ?? user.email[0]}${user.lastName?.[0] ?? ''}`.toUpperCase() : ''

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    navigate(ROUTES.HOME, { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <nav aria-label="Main navigation" className="container-page flex h-16 items-center justify-between gap-4">
        <Link to={roleHome(role)} aria-label="AnyDrive home" className="shrink-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-300/50">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {primary.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={linkClass}>{item.label}</NavLink>
            </li>
          ))}
          {more.length > 0 && (
            <li>
              <Dropdown trigger="More" label="More links">
                {more.map((item) => <MenuLink key={item.to} to={item.to}>{item.label}</MenuLink>)}
              </Dropdown>
            </li>
          )}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 lg:flex">
          {isLoading ? (
            <div className="h-9 w-32 animate-pulse rounded-full bg-primary-50" aria-hidden="true" />
          ) : isAuthenticated ? (
            <Dropdown
              align="right"
              label="Account menu"
              trigger={
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">{initials}</span>
                  <span className="max-w-[8rem] truncate">{user.firstName || user.email}</span>
                </>
              }
            >
              <div className="px-3 pb-2 pt-1">
                <p className="truncate text-sm font-semibold text-primary-900">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
                <Badge tone={role === ROLES.ADMIN ? 'danger' : role === ROLES.AGENCY ? 'accent' : 'primary'} className="mt-2">
                  {ROLE_LABELS[role]}
                </Badge>
              </div>
              <div className="my-1 border-t border-line" />
              {menu.map((item) => <MenuLink key={item.to} to={item.to}>{item.label}</MenuLink>)}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} aria-hidden="true" /> Log out
              </button>
            </Dropdown>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="btn-ghost">Login</Link>
              <Link to={ROUTES.REGISTER_CUSTOMER} className="btn-cta !px-5 !py-2.5 text-sm">Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-xl p-2 text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-100 lg:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-line bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {isAuthenticated && (
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-primary-50 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">{initials}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary-900">{user.name}</p>
                  <p className="text-xs text-muted">{ROLE_LABELS[role]}</p>
                </div>
              </div>
            )}

            {[...primary, ...more].map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={mobileLinkClass}>{item.label}</NavLink>
            ))}

            <div className="mt-3 border-t border-line pt-3">
              {isLoading ? null : isAuthenticated ? (
                <>
                  {menu
                    .filter((m) => ![...primary, ...more].some((l) => l.to === m.to))
                    .map((item) => <NavLink key={item.to} to={item.to} className={mobileLinkClass}>{item.label}</NavLink>)}
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
                    <LogOut size={16} aria-hidden="true" /> Log out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to={ROUTES.LOGIN} className="btn-outline flex-1">Login</Link>
                  <Link to={ROUTES.REGISTER_CUSTOMER} className="btn-cta flex-1 !px-4">Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
