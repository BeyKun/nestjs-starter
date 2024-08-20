import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGurad } from '../auth/guards/jwt.guard';
import { AssignmentsService } from './assignments.service';
import { Prisma } from '@prisma/client';

@Controller('assignments')
@UseGuards(JwtGurad)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  /**
   * Retrieves a list of assignments.
   *
   * @param {string} [search] - Optional search query to filter assignments.
   * @return {Promise<any>} The list of assignments.
   */
  @Get()
  async findAll(@Query('search') search?: string) {
    return await this.assignmentsService.findAll(search);
  }

  /**
   * Creates a new assignment.
   *
   * @param {Prisma.AssignmentCreateInput} req - The input data for creating a new assignment.
   * @return {Promise<any>} The created assignment.
   */
  @Post()
  async create(@Body() req: Prisma.AssignmentCreateInput) {
    return await this.assignmentsService.create(req);
  }

  /**
   * Retrieves a specific assignment by its ID.
   *
   * @param {string} id - The ID of the assignment to retrieve.
   * @return {Promise<any>} The retrieved assignment.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.assignmentsService.findOne(id);
  }

  /**
   * Updates an assignment.
   *
   * @param {string} id - The ID of the assignment to update.
   * @param {Prisma.AssignmentUpdateInput} req - The input data for updating the assignment.
   * @return {Promise<any>} The updated assignment.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() req: Prisma.AssignmentUpdateInput,
  ) {
    return await this.assignmentsService.update(id, req);
  }

  /**
   * Deletes an assignment by its ID.
   *
   * @param {string} id - The ID of the assignment to delete.
   * @return {Promise<any>} The result of the deletion operation.
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.assignmentsService.delete(id);
  }
}
