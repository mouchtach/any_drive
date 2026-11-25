/** Join class names, ignoring falsy values: cn('a', cond && 'b') */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
