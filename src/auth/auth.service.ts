import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
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
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return {
        ...payload,
        access_token: this.jwtService.sign(payload),
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
      password: hashedPassword,
    };
    return this.databaseService.user.create({
      data: newUser,
    });
  }
}
