import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../utils/database/database.service';
import { ResponseDto } from '../utils/dto/response.dto';
import { HelperService } from '../utils/helper/helper.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService,
  ) {}

  /**
   * Creates a new role.
   *
   * @param {Prisma.RoleCreateInput} req - The role creation request.
   * @return {Promise<ResponseDto>} The created role with a 201 status code.
   */
  async create(req: Prisma.RoleCreateInput): Promise<ResponseDto> {
    const role = await this.databaseService.role.create({ data: req });
    return this.helper.response(role, 201);
  }

  /**
   * Retrieves a list of roles based on the provided search query.
   *
   * @param {string} search - The search query to filter roles by.
   * @return {Promise<ResponseDto>} A list of roles matching the search query with a 200 status code.
   */
  async findAll(search: string): Promise<ResponseDto> {
    if (search) {
      const roles = await this.databaseService.role.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      return this.helper.response(roles, 200);
    }

    const roles = await this.databaseService.role.findMany();
    return this.helper.response(roles, 200);
  }

  /**
   * Retrieves a single role by its ID.
   *
   * @param {string} id - The ID of the role to retrieve.
   * @return {Promise<ResponseDto>} The retrieved role with a 200 status code.
   */
  async findOne(id: string): Promise<ResponseDto> {
    const role = await this.databaseService.role.findUniqueOrThrow({
      where: { id },
    });
    return this.helper.response(role, 200);
  }

  /**
   * Updates a role by its unique identifier.
   *
   * @param {string} id - The unique identifier of the role to update.
   * @param {Prisma.RoleUpdateInput} req - The role update request.
   * @return {Promise<ResponseDto>} The updated role with a 200 status code.
   */
  async update(id: string, req: Prisma.RoleUpdateInput): Promise<ResponseDto> {
    await this.databaseService.role.findUniqueOrThrow({
      where: { id },
    });
    const updatedRole = await this.databaseService.role.update({
      where: { id },
      data: req,
    });
    return this.helper.response(updatedRole, 200);
  }

  /**
   * Deletes a role by its unique identifier.
   *
   * @param {string} id - The unique identifier of the role to delete.
   * @return {Promise<ResponseDto>} A Promise that resolves to a ResponseDto with a 200 status code.
   */
  async delete(id: string): Promise<ResponseDto> {
    await this.databaseService.role.findUniqueOrThrow({
      where: { id },
    });
    await this.databaseService.role.delete({
      where: { id },
    });
    return this.helper.response(null, 200);
  }
}
