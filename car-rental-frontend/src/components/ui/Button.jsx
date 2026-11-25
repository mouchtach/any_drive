import { cn } from '@/utils/cn'
import Spinner from './Spinner'

const VARIANTS = {
  cta: 'btn-cta',
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

export default function Button({ variant = 'primary', loading = false, fullWidth = false, className, children, disabled, type = 'button', ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(VARIANTS[variant], fullWidth && 'w-full', className)}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4 border-white/40 border-t-white" />}
      {children}
    </button>
  )
}
