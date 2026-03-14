import { api } from './client'

export type CatalogItem = {
  name: string
  pokeapiId: number
  url: string
}

/** Sprite CDN PokeAPI (sin request extra al backend). */
export function catalogSpriteUrl(pokeapiId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeapiId}.png`
}

export type CatalogResponse = {
  page: number
  limit: number
  total: number
  totalPages: number
  results: CatalogItem[]
}

export async function catalog(page = 0, limit = 20) {
  const { data } = await api.get<CatalogResponse>('/pokeapi/catalog', {
    params: { page, limit },
  })
  return data
}
