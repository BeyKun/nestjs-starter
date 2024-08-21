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
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGurad } from '../auth/guards/jwt.guard';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtGurad)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   * @param {string} search - search keyword
   * @returns {Promise<User[]>}
   */
  @ApiParam({ name: 'search', required: false })
  @Get()
  async findAll(@Query('search') search?: string): Promise<any> {
    return this.usersService.findAll(search);
  }

  /**
   * Get a user by id
   * @param {number} id - user id
   * @returns {Promise<User>}
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.usersService.findOne(id);
  }

  /**
   * Create a new user
   * @param {Prisma.UserCreateInput} req - user data
   * @returns {Promise<User>}
   */
  @Post()
  async create(@Body(ValidationPipe) req: CreateUserDto): Promise<any> {
    return this.usersService.create(req);
  }

  /**
   * Update a user
   * @param {number} id - user id
   * @param {Prisma.UserUpdateInput} req - user data
   * @returns {Promise<User>}
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) req: UpdateUserDto,
  ): Promise<any> {
    return this.usersService.update(id.toString(), req);
  }

  /**
   * Delete a user
   * @param {number} id - user id
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.usersService.delete(id);
  }
}
