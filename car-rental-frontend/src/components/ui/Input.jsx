import { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(function Input({ label, error, hint, className, rightSlot, id, ...props }, ref) {
  const autoId = useId()
  const inputId = id || autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn('input', error && 'border-red-500 focus:border-red-500 focus:ring-red-100', rightSlot && 'pr-12')}
          {...props}
        />
        {rightSlot && <div className="absolute inset-y-0 right-2 flex items-center">{rightSlot}</div>}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
})

export default Input
