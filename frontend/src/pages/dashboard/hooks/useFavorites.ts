import { useCallback, useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { listFavorites, type PokemonFavorite } from '../../../api/pokemon'
import { FAVORITES_LIMIT, SEARCH_DEBOUNCE_MS } from '../constants'

type Args = {
  token: string | null
  onUnauthorized: () => void
}

export function useFavorites({ token, onUnauthorized }: Args) {
  const [items, setItems] = useState<PokemonFavorite[]>([])
  const [total, setTotal] = useState(0)
  const [apiPage, setApiPage] = useState(0)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const itemsRef = useRef(items)
  itemsRef.current = items

  const loadFavorites = useCallback(async () => {
    if (!token) return
    const hadList = itemsRef.current.length > 0
    setError(null)
    if (hadList) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await listFavorites({
        page: apiPage,
        limit: FAVORITES_LIMIT,
        search: searchDebounced || undefined,
        type: typeFilter || undefined,
      })
      setItems(res.data)
      setTotal(res.total)
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        onUnauthorized()
        return
      }
      setError(
        isAxiosError(e)
          ? (e.response?.data?.message as string) || e.message
          : 'Error al cargar favoritos',
      )
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token, apiPage, searchDebounced, typeFilter, onUnauthorized])

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchDebounced(search.trim())
      setApiPage(0)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    if (!token) return
    loadFavorites()
  }, [token, loadFavorites])

  const applyTypeFilter = useCallback(async () => {
    if (!token) return
    setApiPage(0)
    const hadList = itemsRef.current.length > 0
    setError(null)
    if (hadList) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await listFavorites({
        page: 0,
        limit: FAVORITES_LIMIT,
        search: searchDebounced || undefined,
        type: typeFilter || undefined,
      })
      setItems(res.data)
      setTotal(res.total)
    } catch (e) {
      setError(
        isAxiosError(e)
          ? String(e.response?.data?.message || e.message)
          : 'Error',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token, searchDebounced, typeFilter])

  const applyFavoriteUpdate = useCallback((updated: PokemonFavorite) => {
    setItems((prev) =>
      prev.map((it) => (it.id === updated.id ? { ...it, ...updated } : it)),
    )
  }, [])

  return {
    items,
    total,
    apiPage,
    setApiPage,
    uiPage: apiPage + 1,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    searchDebounced,
    loading,
    refreshing,
    error,
    loadFavorites,
    applyTypeFilter,
    applyFavoriteUpdate,
  }
}
