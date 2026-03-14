import type { ReactNode } from 'react'
import { styles } from '../../constants/styles'

type Props = {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function FormField({
  id,
  label,
  error,
  hint,
  required,
  className = '',
  children,
}: Props) {
  return (
    <div className={`flex flex-col ${styles.space.field} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-left text-xs text-[var(--text)]">{hint}</p>
      ) : null}
      {error ? (
        <p
          className="text-left text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
