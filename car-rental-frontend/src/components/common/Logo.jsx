import { cn } from '@/utils/cn'

/** AnyDrive logo: navy "A" with an orange road + wordmark. `light` = for dark backgrounds. */
export default function Logo({ light = false, className }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill={light ? '#FFFFFF' : '#0B3D91'} fillOpacity={light ? 0.12 : 1} />
        <path d="M11 30 20 9l9 21" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 31c7-2 9-8 17-6 3 .8 5 2.500 6 5" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className={cn('text-xl font-extrabold tracking-tight', light ? 'text-white' : 'text-primary-600')}>
        Any<span className="text-accent-500">Drive</span>
      </span>
    </span>
  )
}
