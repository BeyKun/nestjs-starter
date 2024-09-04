import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
