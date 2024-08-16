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
  login(@Body() req: AuthPayloadDto) {
    return this.authService.login(req);
  }

  @Post('register')
  register(@Body() req: Prisma.UserCreateInput) {
    return this.authService.register(req);
  }

  @Get('status')
  @UseGuards(JwtGurad)
  status(@Req() req: Request) {
    return req.user;
  }
}
