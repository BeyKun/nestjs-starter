import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { ResponseDto } from 'src/utils/dto/response.dto';

@Injectable()
export class TrashService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService,
  ) {}

  /**
   * Creates a new trash item and deletes the original item from the specified module.
   *
   * @param {Prisma.TrashCreateInput} body - The input data for creating a new trash item.
   * @param {Request} req - The HTTP request object containing the user's token.
   * @return {Promise<ResponseDto>} The response data with the created trash item and a 201 status code.
   */
  async create(
    body: Prisma.TrashCreateInput,
    req: Request,
  ): Promise<ResponseDto> {
    const user = await this.helper.getUserFromToken(req);
    const payload = JSON.parse(JSON.stringify(body));
    payload.userId = user.id;

    const mdl = await this.databaseService.module.findUniqueOrThrow({
      where: {
        id: payload.moduleId,
      },
    });

    const moduleConstant = this.helper.identifyModule(mdl.constant);
    const data = await (
      this.databaseService[moduleConstant] as any
    ).findUniqueOrThrow({
      where: {
        id: payload.moduleDataId,
      },
    });

    payload.data = JSON.stringify(data);

    let result: any;
    await this.databaseService.$transaction(async (service) => {
      //create in trash
      result = await service.trash.create({
        data: payload,
      });

      //delete from trash
      await (service[moduleConstant] as any).delete({
        where: {
          id: payload.moduleDataId,
        },
      });
    });

    result.data = JSON.parse(result.data);
    return this.helper.response(result, 201);
  }

  /**
   * Retrieves all trash items for a specific module, optionally filtered by search query.
   *
   * @param {Request} req - The HTTP request object containing the user's token.
   * @param {string} moduleId - The ID of the module to retrieve trash items for.
   * @param {string} search - The search query to filter trash items by.
   * @return {Promise<ResponseDto>} The response data with the retrieved trash items.
   */
  async getAll(
    req: Request,
    moduleId: string,
    search: string,
  ): Promise<ResponseDto> {
    const user = await this.helper.getUserFromToken(req);
    let result = [];
    const where: Prisma.TrashWhereInput = {
      userId: user.id,
      moduleId: moduleId,
    };

    if (!moduleId) {
      throw new UnprocessableEntityException('Module id is required');
    }

    if (search) {
      where.data = {
        contains: search,
        mode: 'insensitive',
      };
    }

    result = await this.databaseService.trash.findMany({
      where: where,
    });

    result = result.map((data) => {
      data.data = JSON.parse(data.data);
      return data;
    });

    return this.helper.response(result);
  }

  /**
   * Restores a trash item to its original location and deletes it from the trash.
   *
   * @param {string} trashId - The ID of the trash item to restore.
   * @param {Request} req - The HTTP request object containing the user's token.
   * @return {Promise<ResponseDto>} The response data with the restored item's data.
   */
  async restore(trashId: string, req: Request): Promise<ResponseDto> {
    const user = await this.helper.getUserFromToken(req);
    const trash = await this.databaseService.trash.findUniqueOrThrow({
      where: {
        id: trashId,
      },
      include: {
        Module: true,
      },
    });
    if (trash.userId !== user.id) {
      throw new UnauthorizedException('Access Denied');
    }

    const moduleConstant = this.helper.identifyModule(trash.Module.constant);
    await this.databaseService.$transaction(async (service) => {
      //restore trash
      await (service[moduleConstant as any] as any).create({
        data: JSON.parse(trash.data),
      });

      //delete from trash
      await service.trash.delete({
        where: {
          id: trashId,
        },
      });
    });

    return this.helper.response(JSON.parse(trash.data));
  }
}
