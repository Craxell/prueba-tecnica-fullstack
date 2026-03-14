import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PokemonFavorite } from '../pokemon/pokemon-favorite.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany(() => PokemonFavorite, (f) => f.user)
  favorites: PokemonFavorite[]
}
