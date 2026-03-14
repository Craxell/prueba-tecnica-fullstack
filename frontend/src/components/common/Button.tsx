import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { styles } from '../../constants/styles'

type Variant = 'primary' | 'ghost' | 'danger'

const variantClass: Record<Variant, string> = {
  primary: styles.accent,
  ghost: styles.btnGhost,
  danger: styles.btnDanger,
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50 ${styles.radius.btn} ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
