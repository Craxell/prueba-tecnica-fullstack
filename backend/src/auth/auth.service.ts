import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import type { JwtPayload } from './jwt.strategy'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    const exists = await this.users.findByEmail(email)
    if (exists) throw new ConflictException('Email ya registrado')
    const user = await this.users.create(email, password)
    return this.tokenForUser(user.id, user.email)
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email)
    if (!user) throw new UnauthorizedException('Credenciales inválidas')
    const ok = await this.users.validatePassword(user, password)
    if (!ok) throw new UnauthorizedException('Credenciales inválidas')
    return this.tokenForUser(user.id, user.email)
  }

  private tokenForUser(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email }
    return {
      access_token: this.jwt.sign(payload),
    }
  }
}
