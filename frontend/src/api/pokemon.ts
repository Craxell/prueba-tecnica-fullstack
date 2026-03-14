import { api } from './client'

export type PokemonFavorite = {
  id: string
  pokeapiId: number
  name: string
  imageUrl: string | null
  types: { name: string }[]
  stats: { name: string; base_stat: number }[]
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type ListFavoritesResponse = {
  page: number
  limit: number
  total: number
  totalPages: number
  data: PokemonFavorite[]
}

export async function listFavorites(params: {
  page?: number
  limit?: number
  search?: string
  type?: string
}) {
  const { data } = await api.get<ListFavoritesResponse>('/pokemon', {
    params: {
      page: params.page ?? 0,
      limit: params.limit ?? 10,
      search: params.search || undefined,
      type: params.type || undefined,
    },
  })
  return data
}

export async function createFavorite(body: {
  pokeapiId: number
  notes?: string
}) {
  const { data } = await api.post<PokemonFavorite>('/pokemon', body)
  return data
}

export async function getFavorite(id: string) {
  const { data } = await api.get<PokemonFavorite>(`/pokemon/${id}`)
  return data
}

export async function updateFavoriteNotes(id: string, notes: string) {
  const { data } = await api.put<PokemonFavorite>(`/pokemon/${id}`, {
    notes,
  })
  return data
}

export async function deleteFavorite(id: string) {
  await api.delete(`/pokemon/${id}`)
}
