import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/users.entity';

@Module({
  providers: [AssignmentsService, DatabaseService, HelperService],
  controllers: [AssignmentsController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class AssignmentsModule {}
