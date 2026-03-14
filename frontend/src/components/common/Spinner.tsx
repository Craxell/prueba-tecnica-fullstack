import { Loader2 } from 'lucide-react'

type Props = {
  className?: string
  label?: string
}

export function Spinner({ className = '', label = 'Cargando' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm text-[var(--text)] ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-5 w-5 animate-spin text-[var(--accent)]" />
      {label}
    </span>
  )
}
