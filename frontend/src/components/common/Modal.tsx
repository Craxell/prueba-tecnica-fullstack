import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { styles } from '../../constants/styles'
import { Button } from './Button'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZE_MAX: Record<NonNullable<Props['size']>, string> = {
  sm: 'max-w-lg', // ~512px — detalle compacto
  md: 'max-w-2xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
  className = '',
}: Props) {
  const titleId = useId()
  const maxW = SIZE_MAX[size]

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className={styles.modalOverlay}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${styles.modalPanel} ${maxW} ${className}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id={titleId} className={`text-lg ${styles.heading}`}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--code-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className={`${styles.modalBody} scrollbar-none`}>{children}</div>
        {footer ? (
          <div className={styles.modalFooter}>{footer}</div>
        ) : (
          <div className={`${styles.modalFooter} justify-end`}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
