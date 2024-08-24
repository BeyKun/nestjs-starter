import { Module } from '@nestjs/common';
import { RoleSettingsService } from './role-settings.service';
import { RoleSettingsController } from './role-settings.controller';
import { DatabaseService } from 'src/utils/database/database.service';
import { HelperService } from 'src/utils/helper/helper.service';

@Module({
  providers: [RoleSettingsService, DatabaseService, HelperService],
  controllers: [RoleSettingsController],
})
export class RoleSettingsModule {}
