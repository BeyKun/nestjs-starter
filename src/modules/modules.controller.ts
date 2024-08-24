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
import { ModulesService } from './modules.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGurad } from '../auth/guards/jwt.guard';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiTags('Module')
@ApiBearerAuth()
@UseGuards(JwtGurad)
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  /**
   * Creates a new module.
   *
   * @param {Prisma.ModuleCreateInput} req - The request body containing the module data to be created.
   * @return {Promise<ResponseDto>} The response containing the created module data.
   */
  @Post()
  async create(
    @Body(ValidationPipe) req: CreateModuleDto,
  ): Promise<ResponseDto> {
    return await this.modulesService.create(req);
  }

  /**
   * Retrieves a list of all modules.
   *
   * @param {string} search - Optional search query to filter results
   * @return {Promise<ResponseDto>} Promise resolving to a response containing the list of modules
   */
  @ApiParam({ name: 'search', required: false })
  @Get()
  async findAll(@Query('search') search: string): Promise<ResponseDto> {
    return await this.modulesService.findAll(search);
  }

  /**
   * Retrieves a single module by its ID.
   *
   * @param {string} id - The ID of the module to retrieve
   * @return {Promise<ResponseDto>} The response containing the retrieved module data
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    return await this.modulesService.findOne(id);
  }

  /**
   * Updates an existing module.
   *
   * @param {string} id - The ID of the module to update
   * @param {Prisma.ModuleUpdateInput} req - The request body containing the updated module data
   * @return {Promise<ResponseDto>} The response containing the updated module data
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) req: UpdateModuleDto,
  ): Promise<ResponseDto> {
    return await this.modulesService.update(id, req);
  }

  /**
   * Deletes an existing module by its ID.
   *
   * @param {string} id - The ID of the module to delete
   * @return {Promise<ResponseDto>} The response containing the deleted module data
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ResponseDto> {
    return await this.modulesService.delete(id);
  }
}
