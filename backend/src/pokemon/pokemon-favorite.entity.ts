import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../users/user.entity'

@Entity('pokemon_favorites')
export class PokemonFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  /** ID numérico en PokeAPI (species id) */
  @Column({ name: 'pokeapi_id', type: 'int' })
  pokeapiId: number

  @Column({ type: 'varchar', length: 191 })
  name: string

  @Column({ name: 'image_url', type: 'varchar', length: 512, nullable: true })
  imageUrl: string | null

  /** JSON: [{ name: string }] */
  @Column({ name: 'types_json', type: 'json' })
  typesJson: { name: string }[]

  /** JSON: [{ name, base_stat }] */
  @Column({ name: 'stats_json', type: 'json' })
  statsJson: { name: string; base_stat: number }[]

  @Column({ type: 'text', nullable: true })
  notes: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
