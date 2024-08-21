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
import { SkipThrottle } from '@nestjs/throttler';
import { LoggerService } from '../utils/logger/logger.service';
import { JwtGurad } from '../auth/guards/jwt.guard';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Domain')
@ApiBearerAuth()
@SkipThrottle()
@Controller('domain')
@UseGuards(JwtGurad)
export class DomainController {
  constructor(private readonly domainService: DomainService) {}
  private readonly logger = new LoggerService(DomainController.name);

  /**
   * Creates a new domain in the database.
   *
   * @param {Prisma.DomainCreateInput} createDomainDto - The data to be used for creating the new domain.
   * @return {Promise<any>} A promise that resolves to the newly created domain with a 201 status code.
   */
  @Post()
  create(@Body() createDomainDto: CreateDomainDto): Promise<any> {
    return this.domainService.create(createDomainDto);
  }

  /**
   * Retrieves a list of all domains.
   *
   * @param {string} ip - The IP address of the requesting client.
   * @param {string} [search] - Optional search query to filter results.
   * @return {Promise<any>} A promise that resolves to a list of domains.
   */
  @SkipThrottle({ default: false })
  @ApiParam({ name: 'search', required: false })
  @Get()
  findAll(@Ip() ip: string, @Query('search') search?: string): Promise<any> {
    this.logger.log(`Request for All Domain\t${ip}`, DomainController.name);
    return this.domainService.findAll(search);
  }

  /**
   * Finds a domain by its ID.
   *
   * @param {string} id - The ID of the domain to find.
   * @return {Promise<any>} A promise that resolves to the found domain.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.domainService.findOne(id);
  }

  /**
   * Updates a domain in the database.
   *
   * @param {string} id - The ID of the domain to update.
   * @param {Prisma.DomainUpdateInput} updateDomainDto - The data to be used for updating the domain.
   * @return {Promise<any>} A promise that resolves to the updated domain.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDomainDto: UpdateDomainDto,
  ): Promise<any> {
    return this.domainService.update(id, updateDomainDto);
  }

  /**
   * Removes a domain from the database.
   *
   * @param {string} id - The ID of the domain to remove.
   * @return {Promise<any>} A promise that resolves to the result of the removal operation.
   */
  @Delete(':id')
  delete(@Param('id') id: string): Promise<any> {
    return this.domainService.delete(id);
  }
}
