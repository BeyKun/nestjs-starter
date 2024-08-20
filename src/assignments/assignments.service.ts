import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helper: HelperService,
  ) {}

  async create(req: Prisma.AssignmentCreateInput) {
    const assignment = await this.databaseService.assignment.create({
      data: req,
    });

    return this.helper.response(assignment, 201);
  }

  async findAll(search?: string) {
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
    let where = {};

    if (search) {
      where = {
        OR: [
          {
            user: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            domain: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        ],
      };
    }
    const assignments = await this.databaseService.assignment.findMany({
      select: select,
      where: where,
    });

    return this.helper.response(assignments, 200);
  }
}
