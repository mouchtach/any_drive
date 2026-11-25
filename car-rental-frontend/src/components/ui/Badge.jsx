import { cn } from '@/utils/cn'

const TONES = {
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
}

export default function Badge({ tone = 'primary', className, children }) {
  return <span className={cn('badge', TONES[tone], className)}>{children}</span>
}
