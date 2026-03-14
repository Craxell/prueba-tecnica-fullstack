import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { styles } from '../../constants/styles'

function useNarrowPagination() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const apply = () => setNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return narrow
}

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

  const narrow = useNarrowPagination()
  const windowSize =
    variant === 'wide' ? (narrow ? 5 : 7) : narrow ? 3 : 5
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
          {/* Una sola fila: prev/next fijos; números en scroll horizontal si no caben (evita flex-wrap roto) */}
          <div className="flex w-full max-w-3xl min-w-0 items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => onPageChange(safePage - 1)}
              className={`${btn} shrink-0 ${disabled ? 'opacity-50' : ''}`}
              aria-label={labels.prev ?? 'Página anterior'}
            >
              <ChevronLeft className="h-5 w-5 sm:h-5 sm:w-5" />
            </button>
            <div
              className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto overflow-y-hidden overscroll-x-contain py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Números de página"
            >
              <div className="flex shrink-0 flex-nowrap items-center justify-center gap-1 sm:gap-2">
                {pages.map((p, i) =>
                  p === '…' ? (
                    <span
                      key={`e-${i}`}
                      className="flex min-w-8 shrink-0 items-center justify-center px-0.5 text-sm text-[var(--text)] sm:min-w-10"
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
                      className={`${btn} shrink-0 ${
                        p === safePage ? styles.paginationBtnActive : ''
                      } ${disabled ? 'opacity-50' : ''}`}
                      aria-current={p === safePage ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
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
      <div className="flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-x-visible">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(safePage - 1)}
          className={`${styles.paginationBtn} shrink-0 ${disabled ? 'opacity-50' : ''}`}
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
              className={`${styles.paginationBtn} shrink-0 ${
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
          className={`${styles.paginationBtn} shrink-0 ${disabled ? 'opacity-50' : ''}`}
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
