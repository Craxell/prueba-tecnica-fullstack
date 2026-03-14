import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PokeCache } from './poke-cache.entity'
import { PokeapiController } from './pokeapi.controller'
import { PokeapiService } from './pokeapi.service'

@Module({
  imports: [TypeOrmModule.forFeature([PokeCache])],
  controllers: [PokeapiController],
  providers: [PokeapiService],
  exports: [PokeapiService],
})
export class PokeapiModule {}
