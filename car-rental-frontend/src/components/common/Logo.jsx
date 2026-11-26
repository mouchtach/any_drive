import { cn } from '@/utils/cn'
import darkBackgroundIconUrl from '@/assets/icons/icon2.svg'
import lightBackgroundIconUrl from '@/assets/icons/icon.svg'

/** AnyDrive logo: brand icon + wordmark. `light` = for dark backgrounds. */
export default function Logo({ light = false, className }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img src={light ? darkBackgroundIconUrl : lightBackgroundIconUrl} alt="" width="50" height="50" className="h-12 w-12 object-contain" aria-hidden="true" />
      <span className={cn('text-xl font-extrabold tracking-tight', light ? 'text-white' : 'text-primary-600')}>
        Any<span className="text-accent-500">Drive</span>
      </span>
    </span>
  )
}
