import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../utils/database/database.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { HelperService } from '../utils/helper/helper.service';
import { ResponseDto } from '../utils/dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService,
  ) {}

  /**
   * Authenticates a user based on the provided credentials.
   *
   * @param {AuthPayloadDto} req - The authentication request payload containing the username and password.
   * @return {Promise<ResponseDto>} A promise that resolves with a response containing the access token if the authentication is successful.
   */
  async login(req: AuthPayloadDto): Promise<ResponseDto> {
    const { username, password } = req;
    const user = await this.databaseService.user.findUnique({
      where: {
        email: username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {
        user_id: user.id,
        email: user.email,
      };
      const result = {
        ...payload,
        access_token: await this.jwtService.signAsync(payload),
      };

      return this.helper.response(result, 201, 'Success');
    }
  }

  /**
   * Registers a new user with the provided information.
   *
   * @param {Prisma.UserCreateInput} req - The user registration request payload containing the user's name, email, and password.
   * @return {Promise<ResponseDto>} A promise that resolves with a response containing the newly created user data.
   */
  async register(req: Prisma.UserCreateInput): Promise<ResponseDto> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.password, salt);
    const newUser = {
      name: req.name,
      email: req.email,
    };
    await this.databaseService.user.create({
      data: { ...newUser, password: hashedPassword },
    });

    return this.helper.response(newUser, 201, 'Success');
  }

  /**
   * Retrieves a user's profile information based on the provided request.
   *
   * @param {Request} req - The incoming request object containing the user token.
   * @return {Promise<ResponseDto>} A promise that resolves with a response containing the user's profile data.
   */
  async profile(req: Request): Promise<ResponseDto> {
    const user = await this.helper.getUserFromToken(req);
    return this.helper.response(user, 200, 'Success');
  }
}
