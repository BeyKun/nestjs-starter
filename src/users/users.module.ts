import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../utils/database/database.module';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, DatabaseService, HelperService],
})
export class UsersModule {}
