import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PokeapiModule } from '../pokeapi/pokeapi.module'
import { PokemonFavorite } from './pokemon-favorite.entity'
import { PokemonController } from './pokemon.controller'
import { PokemonService } from './pokemon.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([PokemonFavorite]),
    PokeapiModule,
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
