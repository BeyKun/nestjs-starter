import { Module } from '@nestjs/common';
import { RoleSettingsService } from './role-settings.service';
import { RoleSettingsController } from './role-settings.controller';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [RoleSettingsService, DatabaseService, HelperService],
  controllers: [RoleSettingsController],
})
export class RoleSettingsModule {}
