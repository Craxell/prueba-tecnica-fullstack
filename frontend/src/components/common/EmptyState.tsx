import type { ReactNode } from 'react'
import { styles } from '../../constants/styles'

type Props = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--code-bg)]/30 px-6 py-14 text-center ${className}`}
    >
      {icon ? (
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center ${styles.radius.card} ${styles.accentMuted}`}
        >
          {icon}
        </div>
      ) : null}
      <h3 className={`mb-2 text-base ${styles.heading}`}>{title}</h3>
      {description ? (
        <p className="mb-6 max-w-sm text-sm text-[var(--text)]">
          {description}
        </p>
      ) : null}
      {action}
    </div>
  )
}
