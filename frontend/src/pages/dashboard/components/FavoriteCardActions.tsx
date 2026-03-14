import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2, type LucideIcon } from 'lucide-react'

function CardActionLink({ icon: Icon, label, to, box }: { icon: LucideIcon; label: string; to: string; box: string }) {
  return (
    <Link to={to} className="group flex flex-col items-center gap-1.5 rounded-lg py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 active:scale-95">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${box}`}>
        <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />
      </span>
      <span className="text-center text-[10px] font-medium text-[var(--text-h)]">{label}</span>
    </Link>
  )
}

export function FavoriteCardActions({ favoriteId, onRemoveFavorite }: { favoriteId: string; onRemoveFavorite: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4 border-t border-[var(--border)] bg-[var(--bg)] px-3 py-3 sm:gap-6">
      <CardActionLink icon={Eye} label="Detalle" to={`/app/pokemon/${favoriteId}`} box="bg-sky-500/20 text-sky-400 dark:text-sky-300" />
      <CardActionLink icon={Pencil} label="Editar" to={`/app/pokemon/${favoriteId}/edit`} box="bg-amber-500/20 text-amber-500 dark:text-amber-400" />
      <button type="button" onClick={onRemoveFavorite} className="group flex flex-col items-center gap-1.5 rounded-lg py-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-500 sm:h-10 sm:w-10">
          <Trash2 className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />
        </span>
        <span className="text-center text-[10px] font-medium text-[var(--text-h)]">Quitar favorito</span>
      </button>
    </div>
  )
}
