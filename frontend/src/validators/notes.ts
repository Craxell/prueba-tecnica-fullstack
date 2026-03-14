/** Alineado con CreatePokemonFavoriteDto / UpdatePokemonFavoriteDto (@MaxLength(2000)). */
export const NOTES_MAX_LENGTH = 2000

export function notesLengthError(value: string): string | null {
  if (value.length > NOTES_MAX_LENGTH) {
    return `Las notas no pueden superar ${NOTES_MAX_LENGTH} caracteres.`
  }
  return null
}
