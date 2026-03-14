import { useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { styles } from '../../constants/styles'
import { Button } from '../../components/common'
import { AddCatalogBody } from './components/AddCatalogBody'
import { useCatalogModal } from './hooks/useCatalogModal'

export function AddPokemonPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const catalog = useCatalogModal({
    open: true,
    onAdded: useCallback(async () => navigate('/app', { replace: true }), [navigate]),
  })
  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [token, navigate])
  if (!token) return null
  return (
    <div className={`${styles.pageBg} min-h-svh px-4 py-8 sm:px-6`}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl ${styles.heading}`}>Añadir favorito</h1>
            <p className="text-sm text-[var(--text)]">Catálogo PokeAPI</p>
          </div>
          <Link to="/app" className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${styles.radius.btn} ${styles.btnGhost}`}>
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
        <div className={`${styles.card} p-4 sm:p-6`}>
          {catalog.addError ? <p className={`mb-3 ${styles.error}`}>{catalog.addError}</p> : null}
          <AddCatalogBody
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
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-[var(--border)] pt-4">
            <Button variant="ghost" disabled={catalog.adding} onClick={() => navigate('/app')}>
              Cancelar
            </Button>
            <Button variant="primary" disabled={!catalog.selected || catalog.adding} onClick={catalog.addFavorite}>
              {catalog.adding ? 'Guardando…' : 'Añadir a favoritos'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
