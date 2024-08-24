import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from '../database/database.service';
import { ResponseDto } from '../dto/response.dto';
import * as bcrypt from 'bcrypt';
import { TrashDto } from '../dto/trash.dto';

@Injectable()
export class HelperService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Retrieves a user from the database based on the provided token.
   *
   * @param {Request} req - The incoming request object containing the user token.
   * @return {Promise<User>} The user data retrieved from the database.
   */
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

  /**
   * Returns a standardized response object with the provided data, status code, and message.
   *
   * @param {any} data - The data to be included in the response.
   * @param {number} [code=200] - The HTTP status code of the response.
   * @param {string} [message='Success'] - A message describing the response.
   * @return {ResponseDto} A response object containing the data, message, and code.
   */
  response(
    data: any,
    code: number = 200,
    message: string = 'Success',
  ): ResponseDto {
    return { data: data, message: message, statusCode: code };
  }

  /**
   * Hash password from any string
   *
   * @param {string} password - Password to be hashed
   * @return {Promise<string>} - Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  /**
   * Moves data to the trash by deleting the original data and creating a new entry in the trash.
   *
   * @param {TrashDto} data - The data to be moved to the trash.
   * @return {Promise<any>} The result of the trash creation operation.
   */
  async trash(data: TrashDto) {
    if (data.module && data.data) {
      await this.databaseService[data.module].delete({
        where: { id: data.data.id },
      });
    }
    return await this.databaseService.trash.create({ data: data });
  }
}
