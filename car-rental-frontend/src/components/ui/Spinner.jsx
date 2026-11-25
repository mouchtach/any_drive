import { cn } from '@/utils/cn'

export default function Spinner({ className, fullPage = false, label = 'Loading' }) {
  const spinner = (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-accent-500', className)}
    />
  )
  if (!fullPage) return spinner
  return <div className="flex min-h-[60vh] items-center justify-center">{spinner}</div>
}
