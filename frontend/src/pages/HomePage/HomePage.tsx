import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { styles } from '../../constants/styles'
import { PokemonDetailModal } from './components/PokemonDetailModal'
import { FavoriteCard } from './components/FavoriteCard'
import { FavoritesFilters } from './components/FavoritesFilters'
import { AddCatalogModalBody } from './components/AddCatalogModalBody'
import { RemoveFavoriteModal } from './components/RemoveFavoriteModal'
import {
  Button,
  EmptyState,
  Modal,
  Pagination,
  Spinner,
} from '../../components/common'
import { deleteFavorite } from '../../api/pokemon'
import { FAVORITES_LIMIT } from './constants'
import { useFavorites } from './hooks/useFavorites'
import { useCatalogModal } from './hooks/useCatalogModal'

export function HomePage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const onUnauthorized = useCallback(() => {
    logout()
    navigate('/', { replace: true })
  }, [logout, navigate])

  const favorites = useFavorites({ token, onUnauthorized })

  const [modalOpen, setModalOpen] = useState(false)
  const catalog = useCatalogModal({
    open: modalOpen,
    onAdded: useCallback(async () => {
      setModalOpen(false)
      await favorites.loadFavorites()
    }, [favorites.loadFavorites]),
  })

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [detailModalId, setDetailModalId] = useState<string | null>(null)
  const [detailModalMode, setDetailModalMode] = useState<'view' | 'edit'>(
    'view',
  )

  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [token, navigate])

  const openDetail = useCallback((id: string, mode: 'view' | 'edit') => {
    setDetailModalMode(mode)
    setDetailModalId(id)
  }, [])

  const onDetail = useCallback(
    (id: string) => openDetail(id, 'view'),
    [openDetail],
  )
  const onEdit = useCallback(
    (id: string) => openDetail(id, 'edit'),
    [openDetail],
  )
  const onRemoveFavorite = useCallback((id: string, name: string) => {
    setDeleteTarget({ id, name })
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteFavorite(deleteTarget.id)
      if (detailModalId === deleteTarget.id) setDetailModalId(null)
      setDeleteTarget(null)
      await favorites.loadFavorites()
    } catch {
      /* modal abierto */
    } finally {
      setDeleteLoading(false)
    }
  }, [deleteTarget, detailModalId, favorites.loadFavorites])

  if (!token) return null

  return (
    <div className={`${styles.pageBg} px-4 py-8 sm:px-6`}>
      <header className="mx-auto mb-8 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-2xl ${styles.heading}`}>Dashboard</h1>
          <p className="text-sm text-[var(--text)]">Tus Pokémon favoritos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Añadir favorito
          </Button>
          <Button variant="ghost" onClick={onUnauthorized}>
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6">
        <FavoritesFilters
          search={favorites.search}
          onSearchChange={favorites.setSearch}
          typeFilter={favorites.typeFilter}
          onTypeFilterChange={favorites.setTypeFilter}
          onApplyTypeFilter={favorites.applyTypeFilter}
        />

        {favorites.error && (
          <p className={styles.error} role="alert">
            {favorites.error}
          </p>
        )}

        {favorites.loading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Cargando favoritos…" />
          </div>
        ) : favorites.total === 0 ? (
          <EmptyState
            icon={<Heart className="h-7 w-7" strokeWidth={1.5} />}
            title="Aún no hay favoritos"
            description="Añade Pokémon desde el catálogo oficial (PokeAPI)."
            action={
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Añadir favorito
              </Button>
            }
          />
        ) : (
          <>
            <div
              className={`relative grid gap-3 sm:grid-cols-2 ${favorites.refreshing ? 'opacity-60 transition-opacity' : ''}`}
            >
              {favorites.refreshing ? (
                <div
                  className="pointer-events-none absolute inset-0 z-[1] flex items-start justify-center pt-8"
                  aria-busy
                >
                  <span className="rounded-full bg-[var(--bg)]/90 px-3 py-1 text-xs text-[var(--text)] shadow">
                    Actualizando…
                  </span>
                </div>
              ) : null}
              <ul className="contents">
                {favorites.items.map((f) => (
                  <FavoriteCard
                    key={f.id}
                    favorite={f}
                    onDetail={onDetail}
                    onEdit={onEdit}
                    onRemoveFavorite={onRemoveFavorite}
                  />
                ))}
              </ul>
            </div>
            <div className={`${styles.card} p-4`}>
              <Pagination
                page={favorites.uiPage}
                pageSize={FAVORITES_LIMIT}
                totalItems={favorites.total}
                disabled={favorites.refreshing}
                onPageChange={(p) => favorites.setApiPage(p - 1)}
              />
            </div>
          </>
        )}
      </main>

      <PokemonDetailModal
        open={!!detailModalId}
        favoriteId={detailModalId}
        mode={detailModalMode}
        onClose={() => setDetailModalId(null)}
        on401={onUnauthorized}
        onNotesSaved={favorites.applyFavoriteUpdate}
      />

      <RemoveFavoriteModal
        target={deleteTarget}
        loading={deleteLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => !catalog.adding && setModalOpen(false)}
        title="Añadir desde catálogo"
        size="xl"
        footer={
          <>
            <Button
              variant="ghost"
              disabled={catalog.adding}
              onClick={() => setModalOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              disabled={!catalog.selected || catalog.adding}
              onClick={catalog.addFavorite}
            >
              {catalog.adding ? 'Guardando…' : 'Añadir a favoritos'}
            </Button>
          </>
        }
      >
        {catalog.addError && (
          <p className={`mb-3 ${styles.error}`} role="alert">
            {catalog.addError}
          </p>
        )}
        <AddCatalogModalBody
          catalogItems={catalog.catalogItems}
          catalogTotal={catalog.catalogTotal}
          catalogApiPage={catalog.catalogApiPage}
          catalogLoading={catalog.catalogLoading}
          catalogRefreshing={catalog.catalogRefreshing}
          selected={catalog.selected}
          onSelect={catalog.setSelected}
          onPageChange={catalog.loadCatalog}
          addNotes={catalog.addNotes}
          onAddNotesChange={catalog.setAddNotes}
        />
      </Modal>
    </div>
  )
}
