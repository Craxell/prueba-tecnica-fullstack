/**
 * Constantes visuales alineadas con index.css (--accent, --border, etc.)
 * Uso en className junto con Tailwind para coherencia.
 */
export const styles = {
  pageBg: 'min-h-svh w-full bg-[var(--bg)] text-[var(--text)]',
  card:
    'rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]',
  heading: 'font-medium text-[var(--text-h)] tracking-tight',
  accent:
    'bg-[var(--accent)] text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
  accentMuted: 'bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]',
  input:
    'w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-[var(--text-h)] placeholder:text-[var(--text)]/50 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20',
  label: 'mb-1.5 block text-left text-sm font-medium text-[var(--text-h)]',
  tabActive: 'bg-[var(--accent-bg)] text-[var(--accent)]',
  tabInactive: 'text-[var(--text)] hover:bg-[var(--code-bg)]/80',
  error: 'rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400',
  btnGhost:
    'border border-[var(--border)] bg-transparent text-[var(--text-h)] hover:bg-[var(--code-bg)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
  btnDanger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
  modalOverlay: 'fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center sm:p-6',
  modalPanel:
    'max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]',
  paginationBtn:
    'inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-h)] transition-colors hover:bg-[var(--code-bg)] disabled:pointer-events-none disabled:opacity-40',
  paginationBtnActive:
    'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]',
  radius: { input: 'rounded-xl', btn: 'rounded-xl', card: 'rounded-2xl' },
  space: { section: 'gap-4', field: 'gap-1.5' },
} as const
