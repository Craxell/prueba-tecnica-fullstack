import { ChevronLeft, ChevronRight } from 'lucide-react'
import { styles } from '../../constants/styles'

export type PaginationProps = {
  /** Página actual (1-based) */
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  className?: string
  labels?: { prev?: string; next?: string; page?: string }
  /**
   * `wide` — barra centrada, botones más grandes (modal XL / dashboards).
   * `default` — compacto, texto a un lado en desktop.
   */
  variant?: 'default' | 'wide'
  /** Desactiva flechas y números (p. ej. mientras llega la página). */
  disabled?: boolean
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  className = '',
  labels = {},
  variant = 'default',
  disabled = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1)
  const safePage = Math.min(Math.max(1, page), totalPages)
  const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, totalItems)

  const canPrev = !disabled && safePage > 1
  const canNext = !disabled && safePage < totalPages

  const windowSize = variant === 'wide' ? 7 : 5
  const pages = pageWindow(safePage, totalPages, windowSize)
  const btn = variant === 'wide' ? styles.paginationBtnLg : styles.paginationBtn

  if (variant === 'wide') {
    return (
      <nav
        className={`${styles.paginationBar} ${className}`}
        aria-label="Paginación"
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <p className="text-center text-sm text-[var(--text)]">
            {totalItems === 0 ? (
              'Sin resultados'
            ) : (
              <>
                <span className="font-medium text-[var(--text-h)]">
                  {from}–{to}
                </span>
                <span className="mx-1 text-[var(--text)]">/</span>
                <span className="font-medium text-[var(--text-h)]">
                  {totalItems}
                </span>
                {labels.page ? (
                  <span className="text-[var(--text)]"> {labels.page}</span>
                ) : null}
                <span className="mx-2 hidden text-[var(--text)] sm:inline">
                  ·
                </span>
                <span className="text-[var(--text)]">
                  Página{' '}
                  <span className="font-medium text-[var(--text-h)]">
                    {safePage}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium text-[var(--text-h)]">
                    {totalPages}
                  </span>
                </span>
              </>
            )}
          </p>
          <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => onPageChange(safePage - 1)}
              className={`${btn} shrink-0 ${disabled ? 'opacity-50' : ''}`}
              aria-label={labels.prev ?? 'Página anterior'}
            >
              <ChevronLeft className="h-5 w-5 sm:h-5 sm:w-5" />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2">
              {pages.map((p, i) =>
                p === '…' ? (
                  <span
                    key={`e-${i}`}
                    className="flex min-w-10 items-center justify-center px-1 text-sm text-[var(--text)] sm:min-w-11"
                    aria-hidden
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    disabled={disabled}
                    onClick={() => onPageChange(p)}
                    className={`${btn} ${
                      p === safePage ? styles.paginationBtnActive : ''
                    } ${disabled ? 'opacity-50' : ''}`}
                    aria-current={p === safePage ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => onPageChange(safePage + 1)}
              className={`${btn} shrink-0`}
              aria-label={labels.next ?? 'Página siguiente'}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
      aria-label="Paginación"
    >
      <p className="text-sm text-[var(--text)]">
        {totalItems === 0 ? (
          'Sin resultados'
        ) : (
          <>
            <span className="font-medium text-[var(--text-h)]">
              {from}–{to}
            </span>
            {' de '}
            <span className="font-medium text-[var(--text-h)]">
              {totalItems}
            </span>
            {labels.page ? ` ${labels.page}` : ''}
          </>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(safePage - 1)}
          className={`${styles.paginationBtn} ${disabled ? 'opacity-50' : ''}`}
          aria-label={labels.prev ?? 'Página anterior'}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span
              key={`e-${i}`}
              className="px-2 text-sm text-[var(--text)]"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => onPageChange(p)}
              className={`${styles.paginationBtn} ${
                p === safePage ? styles.paginationBtnActive : ''
              } ${disabled ? 'opacity-50' : ''}`}
              aria-current={p === safePage ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(safePage + 1)}
          className={`${styles.paginationBtn} ${disabled ? 'opacity-50' : ''}`}
          aria-label={labels.next ?? 'Página siguiente'}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}

function pageWindow(
  current: number,
  total: number,
  max: number,
): (number | '…')[] {
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const half = Math.floor(max / 2)
  let start = Math.max(1, current - half)
  let end = Math.min(total, start + max - 1)
  if (end - start + 1 < max) start = Math.max(1, end - max + 1)
  const out: (number | '…')[] = []
  if (start > 1) {
    out.push(1)
    if (start > 2) out.push('…')
  }
  for (let p = start; p <= end; p++) out.push(p)
  if (end < total) {
    if (end < total - 1) out.push('…')
    out.push(total)
  }
  return out
}
