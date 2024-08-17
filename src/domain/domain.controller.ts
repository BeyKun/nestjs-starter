import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Ip,
  UseGuards,
} from '@nestjs/common';
import { DomainService } from './domain.service';
import { Prisma } from '@prisma/client';
import { SkipThrottle } from '@nestjs/throttler';
import { LoggerService } from '../logger/logger.service';
import { JwtGurad } from '../auth/guards/jwt.guard';

@SkipThrottle()
@Controller('domain')
@UseGuards(JwtGurad)
export class DomainController {
  constructor(private readonly domainService: DomainService) {}
  private readonly logger = new LoggerService(DomainController.name);

  @Post()
  create(@Body() createDomainDto: Prisma.DomainCreateInput) {
    return this.domainService.create(createDomainDto);
  }

  @SkipThrottle({ default: false })
  @Get()
  findAll(@Ip() ip: string, @Query('search') search?: string) {
    this.logger.log(`Request for All Domain\t${ip}`, DomainController.name);
    return this.domainService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.domainService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDomainDto: Prisma.DomainUpdateInput,
  ) {
    return this.domainService.update(id, updateDomainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.domainService.remove(id);
  }
}
