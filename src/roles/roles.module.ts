import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseService } from 'src/utils/database/database.service';
import { HelperService } from 'src/utils/helper/helper.service';

@Module({
  providers: [RolesService, DatabaseService, HelperService],
  controllers: [RolesController],
})
export class RolesModule {}
