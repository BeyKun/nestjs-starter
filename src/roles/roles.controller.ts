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
  ValidationPipe,
} from '@nestjs/common';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGurad } from '../auth/guards/jwt.guard';
import { CreateRolesDto } from './dto/create-roles.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtGurad)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Creates a new role.
   *
   * @param {Prisma.RoleCreateInput} req - The request body containing the role data to be created.
   * @return {Promise<ResponseDto>} The response containing the created role data.
   */
  @Post()
  async create(
    @Body(ValidationPipe) req: CreateRolesDto,
  ): Promise<ResponseDto> {
    return await this.rolesService.create(req);
  }

  /**
   * Retrieves a list of all roles.
   *
   * @param {string} search - Optional search query to filter results
   * @return {Promise<ResponseDto>} Promise resolving to a response containing the list of roles
   */
  @ApiParam({ name: 'search', required: false })
  @Get()
  async findAll(@Query('search') search: string): Promise<ResponseDto> {
    return await this.rolesService.findAll(search);
  }

  /**
   * Retrieves a single role by its ID.
   *
   * @param {string} id - The ID of the role to retrieve
   * @return {Promise<ResponseDto>} The response containing the retrieved role data
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    return await this.rolesService.findOne(id);
  }

  /**
   * Updates an existing role.
   *
   * @param {string} id - The ID of the role to update
   * @param {Prisma.roleUpdateInput} req - The request body containing the updated role data
   * @return {Promise<ResponseDto>} The response containing the updated role data
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) req: UpdateRolesDto,
  ): Promise<ResponseDto> {
    return await this.rolesService.update(id, req);
  }

  /**
   * Deletes an existing role by its ID.
   *
   * @param {string} id - The ID of the role to delete
   * @return {Promise<ResponseDto>} The response containing the deleted role data
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseDto> {
    return await this.rolesService.delete(id);
  }
}
