import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../users/users.service'

export type JwtPayload = { sub: string; email: string }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev-change-me',
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.users.findByEmail(payload.email)
    if (!user || user.id !== payload.sub) {
      throw new UnauthorizedException()
    }
    return { userId: user.id, email: user.email }
  }
}
