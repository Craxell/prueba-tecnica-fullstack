import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import type { Request } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreatePokemonFavoriteDto } from './dto/create-pokemon-favorite.dto'
import { UpdatePokemonFavoriteDto } from './dto/update-pokemon-favorite.dto'
import { PokemonService } from './pokemon.service'

type ReqUser = { userId: string }

@Controller('pokemon')
@UseGuards(JwtAuthGuard)
export class PokemonController {
  constructor(private readonly pokemon: PokemonService) {}

  @Get()
  list(
    @Req() req: Request & { user: ReqUser },
    @Query('page') page = '0',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.pokemon.list(req.user.userId, {
      page: parseInt(page, 10) || 0,
      limit: parseInt(limit, 10) || 20,
      search: search?.trim() || undefined,
      type: type?.trim().toLowerCase() || undefined,
    })
  }

  @Get(':id')
  one(
    @Req() req: Request & { user: ReqUser },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.pokemon.getOne(req.user.userId, id)
  }

  @Post()
  add(
    @Req() req: Request & { user: ReqUser },
    @Body() dto: CreatePokemonFavoriteDto,
  ) {
    return this.pokemon.add(req.user.userId, dto.pokeapiId, dto.notes)
  }

  @Put(':id')
  update(
    @Req() req: Request & { user: ReqUser },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePokemonFavoriteDto,
  ) {
    return this.pokemon.updateNotes(req.user.userId, id, dto.notes ?? '')
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: ReqUser },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.pokemon.remove(req.user.userId, id)
    return { ok: true }
  }
}
