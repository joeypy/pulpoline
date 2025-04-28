// src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/register.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { username } });
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const exists = await this.findByUsername(registerDto.username);
    if (exists) throw new ConflictException('Username already taken');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(registerDto.password, salt);
    const user = this.usersRepo.create({
      username: registerDto.username,
      password: hash,
    });
    return this.usersRepo.save(user);
  }
}
