import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService
  ) {}

  async login(req: AuthPayloadDto) {
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
      return {
        ...payload,
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  async register(req: Prisma.UserCreateInput) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.password, salt);
    const newUser = {
      name: req.name,
      email: req.email,
      role: req.role,
    };
    await this.databaseService.user.create({
      data: {...newUser, password: hashedPassword},
    });

    return newUser;
  }

  async profile(req: Request) {
    const user = await this.helper.getUserFromToken(req);
    return this.helper.response(user, 200, 'Success')
  }
}
