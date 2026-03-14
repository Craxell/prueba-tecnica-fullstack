import { Eye, Pencil, Trash2, type LucideIcon } from 'lucide-react'

type Tone = 'blue' | 'amber' | 'red'

function CardAction({
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  tone: Tone
}) {
  const box =
    tone === 'blue'
      ? 'bg-sky-500/20 text-sky-400 dark:text-sky-300'
      : tone === 'amber'
        ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400'
        : 'bg-red-500/20 text-red-500 dark:text-red-400'
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 rounded-lg py-1 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 active:scale-95"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105 sm:h-10 sm:w-10 ${box}`}
      >
        <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />
      </span>
      <span className="text-center text-[10px] font-medium leading-tight text-[var(--text-h)]">
        {label}
      </span>
    </button>
  )
}

export type FavoriteCardActionsProps = {
  onDetail: () => void
  onEdit: () => void
  /** Quitar de favoritos (no borra el Pokémon del mundo, solo de tu lista). */
  onRemoveFavorite: () => void
}

/** Barra de acciones: Detalle / Editar / Quitar de favoritos */
export function FavoriteCardActions({
  onDetail,
  onEdit,
  onRemoveFavorite,
}: FavoriteCardActionsProps) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4 border-t border-[var(--border)] bg-[var(--bg)] px-3 py-3 sm:gap-6">
      <CardAction icon={Eye} label="Detalle" tone="blue" onClick={onDetail} />
      <CardAction icon={Pencil} label="Editar" tone="amber" onClick={onEdit} />
      <CardAction
        icon={Trash2}
        label="Quitar favorito"
        tone="red"
        onClick={onRemoveFavorite}
      />
    </div>
  )
}
