import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../utils/database/database.service';
import { ResponseDto } from '../utils/dto/response.dto';
import { HelperService } from '../utils/helper/helper.service';

@Injectable()
export class RoleSettingsService {
  /**
   * Initializes a new instance of the RoleSettingsService class.
   *
   * @param {DatabaseService} databaseService - The database service instance.
   * @param {HelperService} helper - The helper service instance.
   */
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService,
  ) {}

  /**
   * Creates a new role setting.
   *
   * @param {Prisma.RoleSettingCreateInput} req - The role setting creation request.
   * @return {Promise<ResponseDto>} The created role setting response.
   */
  async create(req: Prisma.RoleSettingCreateInput): Promise<ResponseDto> {
    const payload = JSON.parse(JSON.stringify(req));
    await this.databaseService.module.findUniqueOrThrow({
      where: {
        id: payload.moduleId,
      },
    });
    await this.databaseService.role.findUniqueOrThrow({
      where: {
        id: payload.roleId,
      },
    });
    await this.databaseService.domain.findUniqueOrThrow({
      where: {
        id: payload.domainId,
      },
    });

    const settings = await this.databaseService.roleSetting.create({
      data: req,
    });
    return this.helper.response(settings, 201);
  }

  /**
   * Retrieves a list of role settings based on the provided search query.
   *
   * @param {string} search - The search query to filter role settings by.
   * @return {Promise<ResponseDto>} A list of role settings matching the search query with a 200 status code.
   */
  async findAll(search: string): Promise<ResponseDto> {
    if (search) {
      const settings = await this.databaseService.roleSetting.findMany({
        where: {
          OR: [
            {
              Role: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              Domain: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              Module: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
      });
      return this.helper.response(settings, 200);
    }

    const settings = await this.databaseService.roleSetting.findMany();
    return this.helper.response(settings, 200);
  }

  /**
   * Retrieves a single role setting by its unique identifier.
   *
   * @param {string} id - The unique identifier of the role setting to retrieve.
   * @return {Promise<ResponseDto>} The retrieved role setting response.
   */
  async findOne(id: string): Promise<ResponseDto> {
    const settings = await this.databaseService.roleSetting.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    return this.helper.response(settings, 200);
  }

  /**
   * Updates a role setting by its unique identifier.
   *
   * @param {string} id - The unique identifier of the role setting to update.
   * @param {Prisma.RoleSettingUpdateInput} req - The role setting update request.
   * @return {Promise<ResponseDto>} The updated role setting response.
   */
  async update(
    id: string,
    req: Prisma.RoleSettingUpdateInput,
  ): Promise<ResponseDto> {
    await this.databaseService.roleSetting.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    const settings = await this.databaseService.roleSetting.update({
      where: {
        id: id,
      },
      data: req,
    });
    return this.helper.response(settings, 200);
  }

  /**
   * Deletes a role setting by its unique identifier.
   *
   * @param {string} id - The unique identifier of the role setting to delete.
   * @return {Promise<ResponseDto>} The deleted role setting response.
   */
  async delete(id: string): Promise<ResponseDto> {
    await this.databaseService.roleSetting.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    await this.databaseService.roleSetting.delete({
      where: {
        id: id,
      },
    });
    return this.helper.response(null, 200);
  }
}
