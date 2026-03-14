import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.users.findOne({ where: { email: email.toLowerCase() } })
  }

  async create(email: string, password: string): Promise<User> {
    const passwordHash = bcrypt.hashSync(password, 10)
    const user = this.users.create({
      email: email.toLowerCase(),
      passwordHash,
    })
    return this.users.save(user)
  }

  validatePassword(user: User, password: string) {
    return bcrypt.compareSync(password, user.passwordHash)
  }
}
