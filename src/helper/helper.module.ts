import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HelperService],
  exports: [HelperService]
})
export class HelperModule {}
