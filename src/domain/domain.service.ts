import { Injectable } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DomainService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createDomainDto: Prisma.DomainCreateInput) {
    return this.databaseService.domain.create({
      data: createDomainDto,
    });
  }

  async findAll(search?: string) {
    if (search) {
      return this.databaseService.domain.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      });
    }

    return this.databaseService.domain.findMany();
  }

  @Throttle({ short: { ttl: 1000, limit: 1 } })
  async findOne(id: string) {
    return this.databaseService.domain.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateDomainDto: Prisma.DomainUpdateInput) {
    return this.databaseService.domain.update({
      where: {
        id,
      },
      data: updateDomainDto,
    });
  }

  async remove(id: string) {
    return this.databaseService.domain.delete({
      where: {
        id,
      },
    });
  }
}
