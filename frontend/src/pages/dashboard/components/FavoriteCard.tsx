import { memo } from 'react'
import { styles } from '../../../constants/styles'
import type { PokemonFavorite } from '../../../api/pokemon'
import { FavoriteCardActions } from './FavoriteCardActions'

function Inner({ favorite: f, onRemoveFavorite }: { favorite: PokemonFavorite; onRemoveFavorite: (id: string, name: string) => void }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] text-left shadow-sm">
      <div className="flex gap-4 p-4">
        {f.imageUrl ? <img src={f.imageUrl} alt="" className="h-20 w-20 shrink-0 object-contain" width={80} height={80} /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--code-bg)] text-xs">—</div>}
        <div className="min-w-0 flex-1">
          <p className={`truncate capitalize ${styles.heading} text-base`}>{f.name}</p>
          <p className="text-xs text-[var(--text)]">#{f.pokeapiId} · {f.types.map((t) => t.name).join(', ') || '—'}</p>
          {f.notes ? <p className="mt-1 line-clamp-2 text-xs">{f.notes}</p> : null}
        </div>
      </div>
      <FavoriteCardActions favoriteId={f.id} onRemoveFavorite={() => onRemoveFavorite(f.id, f.name)} />
    </li>
  )
}

export const FavoriteCard = memo(Inner)
