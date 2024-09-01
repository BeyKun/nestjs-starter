import { Module } from '@nestjs/common';
import { TrashService } from './trash.service';
import { TrashController } from './trash.controller';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';

@Module({
  providers: [TrashService, DatabaseService, HelperService],
  controllers: [TrashController],
})
export class TrashModule {}
