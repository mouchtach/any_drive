import { Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import useAuth from '@/features/auth/hooks/useAuth'
import { FOOTER_ACCOUNT } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants/config'

function Column({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-primary-200 transition-colors hover:text-accent-400">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const { role } = useAuth()

  return (
    <footer className="mt-auto bg-gradient-to-br from-primary-800 to-primary-900 text-primary-200">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo light />
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-accent-400">Drive Anywhere. Anytime.</p>
          <p className="mt-3 max-w-xs text-sm">Rent a car from trusted agencies, or manage your fleet — all in one place.</p>
        </div>

        <Column
          title="Explore"
          links={[
            { label: 'Browse cars', to: ROUTES.CARS },
            { label: 'About us', to: ROUTES.ABOUT },
            { label: 'Contact', to: ROUTES.CONTACT },
          ]}
        />

        <Column title="Your account" links={FOOTER_ACCOUNT[role] ?? FOOTER_ACCOUNT.guest} />

        <Column
          title="Help"
          links={[
            { label: 'Forgot password', to: ROUTES.FORGOT_PASSWORD },
            { label: 'Contact support', to: ROUTES.CONTACT },
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Built with React · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
