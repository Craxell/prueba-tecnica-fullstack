import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(STRONG_PASSWORD, {
    message:
      'Debe incluir mayúscula, minúscula, número y un símbolo',
  })
  password: string
}