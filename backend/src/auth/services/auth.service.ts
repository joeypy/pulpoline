// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(pass, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    // omitimos password
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
