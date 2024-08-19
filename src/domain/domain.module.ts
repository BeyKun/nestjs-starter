import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { DatabaseModule } from '../utils/database/database.module';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from 'src/utils/helper/helper.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DomainController],
  providers: [
    DomainService,
    DatabaseService,
    HelperService
  ],
})
export class DomainModule {}
