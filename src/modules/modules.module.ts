import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';

@Module({
  providers: [ModulesService, DatabaseService, HelperService],
  controllers: [ModulesController],
})
export class ModulesModule {}
