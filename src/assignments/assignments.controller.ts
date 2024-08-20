import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGurad } from '../auth/guards/jwt.guard';
import { AssignmentsService } from './assignments.service';
import { Prisma } from '@prisma/client';

@Controller('assignments')
@UseGuards(JwtGurad)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return await this.assignmentsService.findAll(search);
  }

  @Post()
  async create(@Body() req: Prisma.AssignmentCreateInput) {
    return await this.assignmentsService.create(req);
  }
}
