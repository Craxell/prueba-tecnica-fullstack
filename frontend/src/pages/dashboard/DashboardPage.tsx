import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { styles } from '../../constants/styles'
import {
  FavoriteCard,
  FavoritesFilters,
  RemoveFavoriteModal,
} from './components/index.ts'
import {
  Button,
  EmptyState,
  Pagination,
  Spinner,
} from '../../components/common'
import { deleteFavorite } from '../../api/pokemon'
import { FAVORITES_LIMIT } from './constants'
import { useFavorites } from './hooks/useFavorites'

export function DashboardPage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const onUnauthorized = useCallback(() => {
    logout()
    navigate('/', { replace: true })
  }, [logout, navigate])

  const favorites = useFavorites({ token, onUnauthorized })

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [token, navigate])

  const onRemoveFavorite = useCallback((id: string, name: string) => {
    setDeleteTarget({ id, name })
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const name = deleteTarget.name
      await deleteFavorite(deleteTarget.id)
      setDeleteTarget(null)
      await favorites.loadFavorites()
      toast.success(`${name} quitado de favoritos`)
    } catch {
      toast.error('No se pudo quitar de favoritos')
    } finally {
      setDeleteLoading(false)
    }
  }, [deleteTarget, favorites.loadFavorites])

  if (!token) return null

  return (
    <div className={`${styles.pageBg} px-4 py-8 sm:px-6`}>
      <header className="mx-auto mb-8 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-2xl ${styles.heading}`}>Dashboard</h1>
          <p className="text-sm text-[var(--text)]">Tus Pokémon favoritos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/app/pokemon/new"
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold ${styles.radius.btn} ${styles.accent}`}
          >
            <Plus className="h-4 w-4" />
            Añadir favorito
          </Link>
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
              <Link
                to="/app/pokemon/new"
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${styles.radius.btn} ${styles.accent}`}
              >
                <Plus className="h-4 w-4" />
                Añadir favorito
              </Link>
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

      <RemoveFavoriteModal
        target={deleteTarget}
        loading={deleteLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
