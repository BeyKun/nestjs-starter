import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { ResponseDto } from '../utils/dto/response.dto';

@Injectable()
export class DomainService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService,
  ) {}

  /**
   * Creates a new domain in the database.
   *
   * @param {Prisma.DomainCreateInput} createDomainDto - The data to be used for creating the new domain.
   * @return {Promise<Domain>} The newly created domain with a 201 status code.
   */
  async create(
    createDomainDto: Prisma.DomainCreateInput,
  ): Promise<ResponseDto> {
    const domain = await this.databaseService.domain.create({
      data: createDomainDto,
    });
    return this.helper.response(domain, 201);
  }

  /**
   * Retrieves all domains from the database.
   *
   * If a search query is provided, it will filter the results to include only domains
   * whose name or description contain the search query (case-insensitive).
   *
   * @param {string} [search] - Optional search query to filter results
   * @return {Promise<Domain[]>} Promise resolving to an array of domain objects
   */
  async findAll(search?: string): Promise<ResponseDto> {
    let domains = [];
    if (search) {
      domains = await this.databaseService.domain.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      });
    } else {
      domains = await this.databaseService.domain.findMany();
    }

    return this.helper.response(domains, 200);
  }

  @Throttle({ short: { ttl: 1000, limit: 1 } })
  /**
   * Finds a domain by its ID.
   *
   * @param {string} id - The ID of the domain to find.
   * @return {Promise<ResponseDto>} A promise that resolves to a response DTO containing the found domain and a status code of 200.
   */
  async findOne(id: string): Promise<ResponseDto> {
    const domain = await this.databaseService.domain.findUnique({
      where: {
        id,
      },
    });

    if (!domain) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.helper.response(domain, 200);
  }

  /**
   * Updates a domain in the database.
   *
   * @param {string} id - The ID of the domain to update.
   * @param {Prisma.DomainUpdateInput} updateDomainDto - The data to be used for updating the domain.
   * @return {Promise<ResponseDto>} A promise that resolves to a response DTO containing the updated domain and a status code of 200.
   */
  async update(
    id: string,
    updateDomainDto: Prisma.DomainUpdateInput,
  ): Promise<ResponseDto> {
    const domain = await this.databaseService.domain.update({
      where: {
        id,
      },
      data: updateDomainDto,
    });

    return this.helper.response(domain, 200);
  }

  /**
   * Removes a domain from the database.
   *
   * @param {string} id - The ID of the domain to remove.
   * @return {Promise<ResponseDto>} A promise that resolves to a response DTO with a status code of 200 and a success message.
   */
  async delete(id: string): Promise<ResponseDto> {
    await this.databaseService.domain.delete({
      where: {
        id,
      },
    });

    return this.helper.response(null, 200, 'Deleted successfully');
  }
}
