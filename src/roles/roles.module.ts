import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';

@Module({
  providers: [RolesService, DatabaseService, HelperService],
  controllers: [RolesController],
})
export class RolesModule {}
