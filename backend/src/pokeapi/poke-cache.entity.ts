import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

/** Caché de datos de PokeAPI (requisito prueba: id, nombre, imagen, tipos, stats) */
@Entity('poke_cache')
export class PokeCache {
  @PrimaryColumn({ name: 'pokeapi_id', type: 'int' })
  pokeapiId: number

  @Column({ type: 'varchar', length: 191 })
  name: string

  @Column({ name: 'image_url', type: 'varchar', length: 512, nullable: true })
  imageUrl: string | null

  @Column({ name: 'types_json', type: 'json' })
  typesJson: { name: string }[]

  @Column({ name: 'stats_json', type: 'json' })
  statsJson: { name: string; base_stat: number }[]

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
