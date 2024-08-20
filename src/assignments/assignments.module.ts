import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { DatabaseModule } from '../utils/database/database.module';

@Module({
  providers: [AssignmentsService, DatabaseService, HelperService],
  controllers: [AssignmentsController],
  imports: [DatabaseModule],
})
export class AssignmentsModule {}
