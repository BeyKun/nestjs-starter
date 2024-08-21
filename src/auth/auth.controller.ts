import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
// import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtGurad } from './guards/jwt.guard';
import { AuthPayloadDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user based on the provided credentials.
   *
   * @param {AuthPayloadDto} req - The authentication request payload containing the username and password.
   * @return {Promise<any>} A promise that resolves with the authentication result.
   */
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() req: AuthPayloadDto): Promise<any> {
    return await this.authService.login(req);
  }

  /**
   * Registers a new user with the provided information.
   *
   * @param {CreateUserDto} req - The user registration request payload containing the user's name, email, and password.
   * @return {Promise<any>} A promise that resolves with the registration result.
   */
  @Post('register')
  register(@Body() req: CreateUserDto): Promise<any> {
    return this.authService.register(req);
  }

  /**
   * Retrieves the profile information of the user associated with the provided request.
   *
   * @param {Request} req - The incoming request object containing the user token.
   * @return {Promise<any>} A promise that resolves with the user's profile data.
   */
  @Get('profile')
  @UseGuards(JwtGurad)
  @ApiBearerAuth()
  profile(@Req() req: Request): Promise<any> {
    return this.authService.profile(req);
  }
}
