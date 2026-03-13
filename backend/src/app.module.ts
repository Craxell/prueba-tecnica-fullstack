import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { User } from './users/user.entity'
import { PokemonModule } from './pokemon/pokemon.module'
import { PokemonFavorite } from './pokemon/pokemon-favorite.entity'
import { PokeCache } from './pokeapi/poke-cache.entity'
import { PokeapiModule } from './pokeapi/pokeapi.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'pokemon_app',
      entities: [User, PokemonFavorite, PokeCache],
      synchronize: process.env.DB_SYNC !== 'false',
      logging: process.env.DB_LOGGING === 'true',
    }),
    PokeapiModule,
    AuthModule,
    PokemonModule,
  ],
})
export class AppModule {}
