import { useCallback, useEffect, useState } from 'react'
import { Loader2, Pencil, Save } from 'lucide-react'
import { isAxiosError } from 'axios'
import { Button, FormField, Modal, Spinner, TextArea } from '../../../components/common'
import { styles } from '../../../constants/styles'
import {
  getFavorite,
  updateFavoriteNotes,
  type PokemonFavorite,
} from '../../../api/pokemon'

export type DetailModalMode = 'view' | 'edit'

type Props = {
  open: boolean
  favoriteId: string | null
  mode: DetailModalMode
  onClose: () => void
  on401: () => void
  /** Lista / tarjetas: mismas notas al guardar sin F5 */
  onNotesSaved?: (favorite: PokemonFavorite) => void
}

function titleCase(name: string) {
  return name.replace(/-/g, ' ')
}

export function PokemonDetailModal({
  open,
  favoriteId,
  mode,
  onClose,
  on401,
  onNotesSaved,
}: Props) {
  const [pokemon, setPokemon] = useState<PokemonFavorite | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!favoriteId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getFavorite(favoriteId)
      setPokemon(data)
      setNotes(data.notes ?? '')
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        on401()
        return
      }
      if (isAxiosError(e) && e.response?.status === 404) {
        setError('No encontrado.')
      } else {
        setError('Error al cargar.')
      }
      setPokemon(null)
    } finally {
      setLoading(false)
    }
  }, [favoriteId, on401])

  useEffect(() => {
    if (open && favoriteId) {
      setSaveMsg(null)
      load()
    } else if (!open) {
      setPokemon(null)
      setError(null)
    }
  }, [open, favoriteId, load])

  const handleSave = async () => {
    if (!favoriteId) return
    setSaving(true)
    setSaveMsg(null)
    try {
      const updated = await updateFavoriteNotes(favoriteId, notes)
      setPokemon(updated)
      onNotesSaved?.(updated)
      setSaveMsg('Guardado.')
    } catch {
      setSaveMsg('Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const maxStat = pokemon
    ? Math.max(...pokemon.stats.map((s) => s.base_stat), 1)
    : 1

  const modalTitle =
    pokemon && mode === 'view'
      ? `Detalles — ${titleCase(pokemon.name)}`
      : pokemon && mode === 'edit'
        ? `Editar — ${titleCase(pokemon.name)}`
        : mode === 'edit'
          ? 'Editar'
          : 'Detalles'

  return (
    <Modal
        open={open}
        onClose={onClose}
        title={modalTitle}
        size="sm"
        className="[&_h2]:line-clamp-2 [&_h2]:text-left [&_h2]:text-base [&_h2]:capitalize"
        footer={
          <Button variant="ghost" type="button" className="py-2 text-sm" onClick={onClose}>
            Cerrar
          </Button>
        }
      >
        {loading && (
          <div className="flex justify-center py-8">
            <Spinner label="" />
          </div>
        )}
        {error && !loading && (
          <p className={`text-sm ${styles.error}`} role="alert">
            {error}
          </p>
        )}
        {pokemon && !loading && (
          <div className="space-y-3 text-left">
            {/* Fila: sprite + meta | stats con barras cortas */}
            <div className="flex gap-3">
              <div className="flex w-[42%] shrink-0 flex-col items-center gap-2 sm:w-[38%]">
                {pokemon.imageUrl ? (
                  <img
                    src={pokemon.imageUrl}
                    alt=""
                    className="h-24 w-24 object-contain sm:h-28 sm:w-28"
                    width={112}
                    height={112}
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-[var(--code-bg)] text-xs">
                    —
                  </div>
                )}
                <p className="text-center text-[10px] text-[var(--text)]">
                  #{pokemon.pokeapiId}
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  {pokemon.types.map((t) => (
                    <span
                      key={t.name}
                      className={`rounded-full px-1.5 py-px text-[9px] capitalize ${styles.accentMuted}`}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="min-w-0 flex-1 border-l border-[var(--border)] pl-3">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--text)]">
                  Stats
                </p>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {pokemon.stats.map((s) => (
                    <li key={s.name} className="min-w-0">
                      <div className="flex justify-between gap-0.5 text-[10px] text-[var(--text)] sm:text-[11px]">
                        <span className="truncate capitalize">
                          {s.name.replace(/-/g, ' ')}
                        </span>
                        <span className="shrink-0 tabular-nums text-[var(--text-h)]">
                          {s.base_stat}
                        </span>
                      </div>
                      <div className="mt-0.5 h-1 w-full max-w-full overflow-hidden rounded-full bg-[var(--code-bg)]">
                        <div
                          className="h-full rounded-full bg-[var(--accent)]"
                          style={{
                            width: `${Math.min(100, (s.base_stat / maxStat) * 100)}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[10px] text-[var(--text)]">
              Alta {new Date(pokemon.createdAt).toLocaleDateString()}
            </p>

            {/* Notas: solo lectura en vista; edición en modo editar */}
            <section className="rounded-lg border border-[var(--border)] bg-[var(--code-bg)]/15 p-3">
              <h3
                className={`mb-1.5 flex items-center gap-1.5 text-xs font-medium ${styles.heading}`}
              >
                <Pencil className="h-3.5 w-3.5 text-[var(--accent)]" />
                Notas
              </h3>
              {mode === 'view' ? (
                <p className="min-h-[2.5rem] whitespace-pre-wrap text-sm text-[var(--text-h)]">
                  {pokemon.notes?.trim()
                    ? pokemon.notes
                    : 'Sin notas.'}
                </p>
              ) : (
                <>
                  <FormField id="modal-notes" label="" className="mb-1.5">
                    <TextArea
                      id="modal-notes"
                      rows={3}
                      className="min-h-0 py-2 text-sm"
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value)
                        setSaveMsg(null)
                      }}
                      placeholder="Notas…"
                    />
                  </FormField>
                  <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      className="py-2 text-sm"
                      disabled={saving}
                      onClick={handleSave}
                    >
                      {saving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      Guardar
                    </Button>
                    {saveMsg ? (
                      <span className="text-[10px] text-[var(--text)]">
                        {saveMsg}
                      </span>
                    ) : null}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
    </Modal>
  )
}
