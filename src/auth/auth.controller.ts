import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
// import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtGurad } from './guards/jwt.guard';
import { Prisma } from '@prisma/client';
import { AuthPayloadDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() req: AuthPayloadDto) {
    return await this.authService.login(req);
  }

  @Post('register')
  register(@Body() req: Prisma.UserCreateInput) {
    return this.authService.register(req);
  }

  @Get('profile')
  @UseGuards(JwtGurad)
  profile(@Req() req: Request) {
    return this.authService.profile(req);
  }
}
