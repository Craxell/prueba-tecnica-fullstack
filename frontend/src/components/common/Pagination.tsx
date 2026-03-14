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
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  className = '',
  labels = {},
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1)
  const safePage = Math.min(Math.max(1, page), totalPages)
  const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, totalItems)

  const canPrev = safePage > 1
  const canNext = safePage < totalPages

  const pages = pageWindow(safePage, totalPages, 5)

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
          className={styles.paginationBtn}
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
              onClick={() => onPageChange(p)}
              className={`${styles.paginationBtn} ${
                p === safePage ? styles.paginationBtnActive : ''
              }`}
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
          className={styles.paginationBtn}
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
