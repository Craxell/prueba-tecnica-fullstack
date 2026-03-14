import {
  BadGatewayException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PokeapiService } from '../pokeapi/pokeapi.service'
import { PokemonFavorite } from './pokemon-favorite.entity'

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonFavorite)
    private readonly favorites: Repository<PokemonFavorite>,
    private readonly pokeapi: PokeapiService,
  ) {}

  async list(
    userId: string,
    opts: {
      page?: number
      limit?: number
      search?: string
      type?: string
    } = {},
  ) {
    const page = Math.max(0, opts.page ?? 0)
    const safeLimit = Math.min(Math.max(opts.limit ?? 20, 1), 50)
    const qb = this.favorites
      .createQueryBuilder('f')
      .where('f.user_id = :userId', { userId })
      .orderBy('f.created_at', 'DESC')

    if (opts.search) {
      qb.andWhere('LOWER(f.name) LIKE :s', {
        s: `%${opts.search.toLowerCase()}%`,
      })
    }
    if (opts.type) {
      qb.andWhere(
        `JSON_SEARCH(f.types_json, 'one', :typeName, NULL, '$[*].name') IS NOT NULL`,
        { typeName: opts.type },
      )
    }

    const total = await qb.getCount()
    const items = await qb
      .skip(page * safeLimit)
      .take(safeLimit)
      .getMany()

    return {
      page,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 0,
      data: items.map((f) => this.toDto(f)),
    }
  }

  async getOne(userId: string, id: string) {
    const f = await this.favorites.findOne({ where: { id, userId } })
    if (!f) throw new NotFoundException()
    return this.toDto(f)
  }

  async add(userId: string, pokeapiId: number, notes?: string) {
    const dup = await this.favorites.findOne({ where: { userId, pokeapiId } })
    if (dup) throw new ConflictException('Ya está en favoritos')
    let cache
    try {
      cache = await this.pokeapi.fetchByIdOrName(pokeapiId)
    } catch (e) {
      if (e instanceof BadGatewayException) throw e
      throw new BadGatewayException('No se pudo resolver el Pokémon en PokeAPI')
    }
    const row = this.favorites.create({
      userId,
      pokeapiId: cache.pokeapiId,
      name: cache.name,
      imageUrl: cache.imageUrl,
      typesJson: cache.typesJson,
      statsJson: cache.statsJson,
      notes: notes ?? null,
    })
    const saved = await this.favorites.save(row)
    return this.toDto(saved)
  }

  async updateNotes(userId: string, id: string, notes: string) {
    const f = await this.favorites.findOne({ where: { id, userId } })
    if (!f) throw new NotFoundException()
    f.notes = notes
    await this.favorites.save(f)
    return this.toDto(f)
  }

  async remove(userId: string, id: string) {
    const res = await this.favorites.delete({ id, userId })
    if (!res.affected) throw new NotFoundException()
  }

  private toDto(f: PokemonFavorite) {
    return {
      id: f.id,
      pokeapiId: f.pokeapiId,
      name: f.name,
      imageUrl: f.imageUrl,
      types: f.typesJson,
      stats: f.statsJson,
      notes: f.notes,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }
  }
}
