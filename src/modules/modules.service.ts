import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../utils/database/database.service';
import { ResponseDto } from '../utils/dto/response.dto';
import { HelperService } from '../utils/helper/helper.service';

@Injectable()
export class ModulesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService,
  ) {}

  /**
   * Creates a new module.
   *
   * @param {Prisma.ModuleCreateInput} req - The module creation request.
   * @return {Promise<ResponseDto>} The created module with a 201 status code.
   */
  async create(req: Prisma.ModuleCreateInput): Promise<ResponseDto> {
    const module = await this.databaseService.module.create({
      data: req,
    });
    return this.helper.response(module, 201);
  }

  /**
   * Retrieves a list of modules based on the provided search query.
   *
   * @param {string} search - The search query to filter modules by.
   * @return {Promise<ResponseDto>} A list of modules matching the search query with a 200 status code.
   */
  async findAll(search: string): Promise<ResponseDto> {
    let where: Prisma.ModuleWhereInput = {};
    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      };
    }
    const modules = await this.databaseService.module.findMany({ where });
    return this.helper.response(modules, 200);
  }

  /**
   * Retrieves a single module by its unique identifier.
   *
   * @param {string} id - The unique identifier of the module to retrieve.
   * @return {Promise<ResponseDto>} The retrieved module with a 200 status code.
   */
  async findOne(id: string): Promise<ResponseDto> {
    const module = await this.databaseService.module.findUniqueOrThrow({
      where: { id },
    });
    return this.helper.response(module, 200);
  }

  /**
   * Updates a module by its unique identifier.
   *
   * @param {string} id - The unique identifier of the module to update.
   * @param {Prisma.ModuleUpdateInput} req - The module update request.
   * @return {Promise<ResponseDto>} The updated module with a 200 status code.
   */
  async update(
    id: string,
    req: Prisma.ModuleUpdateInput,
  ): Promise<ResponseDto> {
    await this.databaseService.module.findUniqueOrThrow({
      where: { id },
    });
    const updatedModule = await this.databaseService.module.update({
      where: { id },
      data: req,
    });
    return this.helper.response(updatedModule, 200);
  }

  /**
   * Deletes a module by its unique identifier.
   *
   * @param {string} id - The unique identifier of the module to delete.
   * @return {Promise<ResponseDto>} The deleted module with a 200 status code.
   */
  async delete(id: string): Promise<ResponseDto> {
    await this.databaseService.module.findUniqueOrThrow({
      where: { id },
    });
    await this.databaseService.module.delete({
      where: { id },
    });
    return this.helper.response(null, 200);
  }
}
