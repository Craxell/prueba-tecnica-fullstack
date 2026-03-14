import { BadGatewayException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PokeCache } from './poke-cache.entity'

const BASE = 'https://pokeapi.co/api/v2'

type PokeApiPokemon = {
  id: number
  name: string
  sprites: { front_default: string | null }
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
}

@Injectable()
export class PokeapiService {
  constructor(
    @InjectRepository(PokeCache)
    private readonly cacheRepo: Repository<PokeCache>,
  ) {}

  async fetchAndCache(pokeapiId: number): Promise<PokeCache> {
    const existing = await this.cacheRepo.findOneBy({ pokeapiId })
    if (existing) return existing

    const row = await this.fetchFromApi(pokeapiId)
    await this.cacheRepo.save(row)
    return row
  }

  /** Por id numérico o nombre (PokeAPI acepta ambos en /pokemon/:idOrName) */
  async fetchByIdOrName(idOrName: string | number): Promise<PokeCache> {
    const url = `${BASE}/pokemon/${idOrName}`
    let res: Response
    try {
      res = await fetch(url)
    } catch {
      throw new BadGatewayException('No se pudo contactar PokeAPI')
    }
    if (!res.ok) {
      if (res.status === 404)
        throw new BadGatewayException('Pokémon no encontrado en PokeAPI')
      throw new BadGatewayException(`PokeAPI respondió ${res.status}`)
    }
    const data = (await res.json()) as PokeApiPokemon
    const row: PokeCache = {
      pokeapiId: data.id,
      name: data.name,
      imageUrl: data.sprites.front_default,
      typesJson: data.types.map((t) => ({ name: t.type.name })),
      statsJson: data.stats.map((s) => ({
        name: s.stat.name,
        base_stat: s.base_stat,
      })),
      updatedAt: new Date(),
    }
    await this.cacheRepo.upsert(row, ['pokeapiId'])
    return row
  }

  private async fetchFromApi(pokeapiId: number): Promise<PokeCache> {
    return this.fetchByIdOrName(pokeapiId)
  }

  /**
   * Listado paginado PokeAPI (límite 20 por página, requisito prueba).
   * offset = page * 20
   */
  async listPaged(page = 0, limit = 20) {
    const safeLimit = Math.min(Math.max(limit, 1), 20)
    const offset = page * safeLimit
    let res: Response
    try {
      res = await fetch(
        `${BASE}/pokemon?offset=${offset}&limit=${safeLimit}`,
      )
    } catch {
      throw new BadGatewayException('No se pudo contactar PokeAPI')
    }
    if (!res.ok)
      throw new BadGatewayException(`PokeAPI respondió ${res.status}`)
    const data = (await res.json()) as {
      results: { name: string; url: string }[]
      count: number
    }
    const totalPages = Math.ceil(data.count / safeLimit)
    return {
      page,
      limit: safeLimit,
      total: data.count,
      totalPages,
      results: data.results.map((r) => {
        const id = parseInt(r.url.split('/').filter(Boolean).pop() ?? '0', 10)
        return { name: r.name, pokeapiId: id, url: r.url }
      }),
    }
  }
}
