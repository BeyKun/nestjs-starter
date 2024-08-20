import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HelperService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUserFromToken(req: Request) {
    const payload = JSON.parse(JSON.stringify(req.user));
    const user = await this.databaseService.user.findUnique({
      where: {
        id: payload.user_id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }

  response(data: any, code: number = 200, message: string = 'Success') {
    return { data: data, message: message, code: code };
  }
}
