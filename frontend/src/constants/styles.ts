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
  radius: { input: 'rounded-xl', btn: 'rounded-xl', card: 'rounded-2xl' },
  space: { section: 'gap-4', field: 'gap-1.5' },
} as const
