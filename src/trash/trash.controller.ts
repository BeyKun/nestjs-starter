import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGurad } from 'src/auth/guards/jwt.guard';
import { TrashService } from './trash.service';
import { CreateTrashDto } from './dto/create-trash.dto';
import { Request } from 'express';

@ApiTags('Trash')
@ApiBearerAuth()
@UseGuards(JwtGurad)
@Controller('trash')
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Post()
  async create(@Body() body: CreateTrashDto, @Req() req: Request) {
    return await this.trashService.create(body, req);
  }

  @ApiParam({ name: 'search', required: false })
  @ApiParam({ name: 'moduleId', required: true })
  @Get('list')
  async getAll(
    @Req() req: Request,
    @Query('moduleId') moduleId: string,
    @Query('search') search: string,
  ) {
    return await this.trashService.getAll(req, moduleId, search);
  }

  @Put('restore/:id')
  async restore(@Param('id') id: string, @Req() req: Request) {
    return await this.trashService.restore(id, req);
  }
}
