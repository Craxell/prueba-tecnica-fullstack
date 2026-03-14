import { styles } from '../../../constants/styles'
import {
  FormField,
  Pagination,
  Spinner,
  TextArea,
} from '../../../components/common'
import { catalogSpriteUrl, type CatalogItem } from '../../../api/pokeapi'
import { CATALOG_LIMIT } from '../constants'

type Props = {
  catalogItems: CatalogItem[]
  catalogTotal: number
  catalogApiPage: number
  catalogLoading: boolean
  catalogRefreshing: boolean
  selected: CatalogItem | null
  onSelect: (row: CatalogItem) => void
  onPageChange: (pageIndex: number) => void
  addNotes: string
  onAddNotesChange: (v: string) => void
}

export function AddCatalogModalBody({
  catalogItems,
  catalogTotal,
  catalogApiPage,
  catalogLoading,
  catalogRefreshing,
  selected,
  onSelect,
  onPageChange,
  addNotes,
  onAddNotesChange,
}: Props) {
  if (catalogLoading && catalogItems.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Spinner label="Catálogo…" />
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(catalogTotal / CATALOG_LIMIT))

  return (
    <div
      className={`relative ${catalogRefreshing ? 'opacity-70 transition-opacity' : ''}`}
    >
      {catalogRefreshing ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] flex items-start justify-center pt-6"
          aria-busy
        >
          <span className="rounded-full bg-[var(--bg)]/95 px-3 py-1 text-xs text-[var(--text)] shadow">
            Cargando página…
          </span>
        </div>
      ) : null}
      <p className="mb-3 text-sm text-[var(--text)]">
        Elige uno (página {catalogApiPage + 1} de {totalPages}).
      </p>
      <ul className="scrollbar-none mb-4 grid max-h-[44vh] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {catalogItems.map((row) => (
          <li key={row.pokeapiId}>
            <button
              type="button"
              disabled={catalogRefreshing}
              onClick={() => onSelect(row)}
              className={`flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center text-sm capitalize transition-colors disabled:pointer-events-none ${
                selected?.pokeapiId === row.pokeapiId
                  ? `${styles.tabActive} border-[var(--accent)]`
                  : 'border-[var(--border)] hover:bg-[var(--code-bg)]'
              }`}
            >
              <span className="flex h-14 w-full items-center justify-center sm:h-16">
                <img
                  src={catalogSpriteUrl(row.pokeapiId)}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="max-h-14 max-w-full object-contain object-bottom sm:max-h-16"
                  onError={(e) => {
                    const el = e.currentTarget
                    if (!el.dataset.fallback) {
                      el.dataset.fallback = '1'
                      el.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${row.pokeapiId}.png`
                    }
                  }}
                />
              </span>
              <span className="line-clamp-1 w-full font-medium text-[var(--text-h)]">
                {row.name}
              </span>
              <span className="text-[10px] text-[var(--text)]">
                #{row.pokeapiId}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mb-4 w-full">
        <Pagination
          variant="wide"
          page={catalogApiPage + 1}
          pageSize={CATALOG_LIMIT}
          totalItems={catalogTotal}
          disabled={catalogRefreshing}
          onPageChange={(p) => onPageChange(p - 1)}
        />
      </div>
      <FormField
        id="add-notes"
        label="Notas (opcional)"
        hint="Se guardan con el favorito."
      >
        <TextArea
          id="add-notes"
          value={addNotes}
          disabled={catalogRefreshing}
          onChange={(e) => onAddNotesChange(e.target.value)}
          rows={3}
          placeholder="Opcional…"
        />
      </FormField>
    </div>
  )
}
