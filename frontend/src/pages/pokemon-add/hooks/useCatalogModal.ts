import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { createFavorite } from '../../../api/pokemon'
import { notesLengthError } from '../../../validators/notes'
import { catalog, type CatalogItem } from '../../../api/pokeapi'
import { CATALOG_LIMIT } from '../constants'

export function useCatalogModal({
  open,
  onAdded,
}: {
  open: boolean
  onAdded: () => Promise<void>
}) {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([])
  const [catalogTotal, setCatalogTotal] = useState(0)
  const [catalogApiPage, setCatalogApiPage] = useState(0)
  const [catalogLoading, setCatalogLoading] = useState(false)
  const [catalogRefreshing, setCatalogRefreshing] = useState(false)
  const catalogItemsRef = useRef(catalogItems)
  catalogItemsRef.current = catalogItems
  const [selected, setSelected] = useState<CatalogItem | null>(null)
  const [addNotes, setAddNotes] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const loadCatalog = useCallback(async (page: number, opts?: { replace?: boolean }) => {
    const replace = opts?.replace === true
    setAddError(null)
    if (replace) {
      setCatalogItems([])
      setCatalogTotal(0)
      setCatalogLoading(true)
      setCatalogRefreshing(false)
    } else if (catalogItemsRef.current.length > 0) setCatalogRefreshing(true)
    else setCatalogLoading(true)
    try {
      const res = await catalog(page, CATALOG_LIMIT)
      setCatalogItems(res.results)
      setCatalogTotal(res.total)
      setCatalogApiPage(res.page)
    } catch {
      const msg = 'No se pudo cargar el catálogo'
      setAddError(msg)
      toast.error(msg)
      setCatalogItems([])
      setCatalogTotal(0)
    } finally {
      setCatalogLoading(false)
      setCatalogRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setSelected(null)
      setAddNotes('')
      loadCatalog(0, { replace: true })
    }
  }, [open, loadCatalog])

  const addFavorite = useCallback(async () => {
    if (!selected) return
    const notesErr = notesLengthError(addNotes)
    if (notesErr) {
      setAddError(notesErr)
      toast.error(notesErr)
      return
    }
    setAdding(true)
    setAddError(null)
    try {
      await createFavorite({ pokeapiId: selected.pokeapiId, notes: addNotes.trim() || undefined })
      setSelected(null)
      setAddNotes('')
      toast.success(`${selected.name} añadido a favoritos`)
      await onAdded()
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 409) {
        setAddError('Ese Pokémon ya está en favoritos.')
        toast.error('Already in favorites')
      } else {
        const msg = isAxiosError(e) ? String(e.response?.data?.message || e.message) : 'No se pudo añadir'
        setAddError(msg)
        toast.error('No se pudo añadir a favoritos')
      }
    } finally {
      setAdding(false)
    }
  }, [selected, addNotes, onAdded])

  return {
    catalogItems,
    catalogTotal,
    catalogApiPage,
    catalogLoading,
    catalogRefreshing,
    loadCatalog,
    selected,
    setSelected,
    addNotes,
    setAddNotes,
    adding,
    addError,
    addFavorite,
  }
}
