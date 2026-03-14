import { Controller, Get, Param, Query } from '@nestjs/common'
import { PokeapiService } from './pokeapi.service'

@Controller('pokeapi')
export class PokeapiController {
  constructor(private readonly pokeapi: PokeapiService) {}

  @Get('catalog')
  catalog(@Query('page') page = '0') {
    return this.pokeapi.listPaged(parseInt(page, 10) || 0, 20)
  }

  /** Lee PokeAPI y guarda en caché (id numérico o nombre) */
  @Get('pokemon/:idOrName')
  one(@Param('idOrName') idOrName: string) {
    const n = parseInt(idOrName, 10)
    return this.pokeapi.fetchByIdOrName(Number.isNaN(n) ? idOrName : n)
  }
}
