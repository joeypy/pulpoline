// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.userService.create(dto);
    return { id: user.id, username: user.username };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // req.user proviene de LocalStrategy.validate
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test') // endpoint de prueba
  authTest(@Request() req) {
    return { ok: true, user: req.user };
  }
}
