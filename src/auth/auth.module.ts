import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../utils/database/database.module';
import { HelperModule } from '../utils/helper/helper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/users.entity';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    HelperModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
