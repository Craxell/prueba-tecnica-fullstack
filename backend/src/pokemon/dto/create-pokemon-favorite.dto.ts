import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreatePokemonFavoriteDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pokeapiId: number

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string
}
