import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { Prisma } from '@prisma/client';
import { ResponseDto } from '../utils/dto/response.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService,
  ) {}

  /**
   * Creates a new assignment in the database.
   *
   * @param {Prisma.AssignmentCreateInput} req - The input data for creating a new assignment.
   * @return {Assignment} The created assignment with a 201 status code.
   */
  async create(req: Prisma.AssignmentCreateInput): Promise<ResponseDto> {
    const payload = JSON.parse(JSON.stringify(req));
    const user = await this.databaseService.user.findUnique({
      where: {
        id: payload.user_id,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const domain = await this.databaseService.domain.findUnique({
      where: {
        id: payload.domain_id,
      },
    });

    if (!domain) {
      throw new UnprocessableEntityException('Domain not found');
    }

    const assignment = await this.databaseService.assignment.create({
      data: req,
    });

    return this.helper.response(assignment, 201);
  }

  /**
   * Retrieves a list of assignments from the database.
   *
   * @param {string} [searchQuery] - Optional search query to filter assignments by user or domain name.
   * @return {Assignment[]} The list of assignments with a 200 status code.
   */
  async findAll(searchQuery?: string): Promise<ResponseDto> {
    const select = {
      id: true,
      user_id: true,
      domain_id: true,
      user: {
        select: {
          name: true,
        },
      },
      domain: {
        select: {
          name: true,
          description: true,
        },
      },
    };

    let where: Prisma.AssignmentWhereInput = {};

    if (searchQuery) {
      where = {
        OR: [
          {
            user: {
              name: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
          },
          {
            domain: {
              name: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
          },
        ],
      };
    }

    const assignments = await this.databaseService.assignment.findMany({
      select,
      where,
    });

    return this.helper.response(assignments, 200);
  }

  /**
   * Retrieves a specific assignment from the database.
   *
   * @param {string} id - The ID of the assignment to retrieve.
   * @return {Assignment} The retrieved assignment with a 200 status code.
   */
  async findOne(id: string): Promise<ResponseDto> {
    const assignment = await this.databaseService.assignment.findUnique({
      where: {
        id: id,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Not Found');
    }

    return this.helper.response(assignment, 200);
  }

  /**
   * Updates an assignment in the database.
   *
   * @param {string} id - The ID of the assignment to update.
   * @param {Prisma.AssignmentUpdateInput} req - The input data for updating the assignment.
   * @return {Assignment} The updated assignment with a 200 status code.
   */
  async update(
    id: string,
    req: Prisma.AssignmentUpdateInput,
  ): Promise<ResponseDto> {
    const assignment = await this.databaseService.assignment.update({
      where: {
        id: id,
      },
      data: { role: req.role },
    });

    return this.helper.response(assignment, 200);
  }

  /**
   * Deletes an assignment from the database.
   *
   * @param {string} id - The ID of the assignment to delete.
   * @return {ResponseDto} A response DTO indicating the deletion was successful with a status code of 200.
   */
  async delete(id: string): Promise<ResponseDto> {
    const assignment = await this.databaseService.assignment.findUnique({
      where: {
        id: id,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Not Found');
    }

    await this.databaseService.assignment.delete({
      where: {
        id: id,
      },
    });

    return this.helper.response(null, 200);
  }
}
