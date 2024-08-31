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
import { RoleSettingsService } from './role-settings.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGurad } from '../auth/guards/jwt.guard';
import { CreateRoleSettingsDto } from './dto/create-role-settings.dto';
import { ResponseDto } from '../utils/dto/response.dto';
import { UpdateRoleSettingsDto } from './dto/update-role-settings.dto';

@ApiTags('Role Settings')
@ApiBearerAuth()
@UseGuards(JwtGurad)
@Controller('role-settings')
export class RoleSettingsController {
  constructor(private readonly roleSettingsService: RoleSettingsService) {}

  /**
   * Creates a new role setting.
   *
   * @param {CreateRoleSettingsDto} req - The role setting creation request.
   * @return {Promise<ResponseDto>} The created role setting response.
   */
  @Post()
  async create(
    @Body(ValidationPipe) req: CreateRoleSettingsDto,
  ): Promise<ResponseDto> {
    return await this.roleSettingsService.create(req);
  }

  /**
   * Retrieves all role settings based on the provided search query.
   *
   * @param {string} search - The search query to filter role settings by.
   * @return {Promise<ResponseDto>} A list of role settings matching the search query.
   */
  @ApiParam({ name: 'search', required: false })
  @Get()
  async findAll(@Query('search') search: string): Promise<ResponseDto> {
    return await this.roleSettingsService.findAll(search);
  }

  /**
   * Retrieves a single role setting by its ID.
   *
   * @param {string} id - The ID of the role setting to retrieve.
   * @return {Promise<ResponseDto>} The retrieved role setting response.
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    return await this.roleSettingsService.findOne(id);
  }

  /**
   * Updates an existing role setting.
   *
   * @param {string} id - The ID of the role setting to update.
   * @param {UpdateRoleSettingsDto} req - The role setting update request.
   * @return {Promise<ResponseDto>} The updated role setting response.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) req: UpdateRoleSettingsDto,
  ): Promise<ResponseDto> {
    return await this.roleSettingsService.update(id, req);
  }

  /**
   * Deletes a role setting by its ID.
   *
   * @param {string} id - The ID of the role setting to delete.
   * @return {Promise<ResponseDto>} The deletion response.
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseDto> {
    return await this.roleSettingsService.delete(id);
  }
}
