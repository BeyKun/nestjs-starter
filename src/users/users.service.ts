import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { ResponseDto } from '../utils/dto/response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helperService: HelperService,
  ) {}

  /**
   * Get all users
   * @param {string} [search] - Optional search query to filter users by name
   * @returns {Promise<ResponseDto>} Array of users
   */
  async findAll(search?: string): Promise<ResponseDto> {
    let users = [];
    if (search) {
      users = await this.databaseService.user.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });
    } else {
      users = await this.databaseService.user.findMany();
    }

    return this.helperService.response(users, 200);
  }

  /**
   * Get one user by id
   * @param {number} id User id
   * @returns {Promise<ResponseDto>} User
   */
  async findOne(id: string): Promise<ResponseDto> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.helperService.response(user, 200);
  }

  /**
   * Create new user
   * @param {Prisma.UserCreateInput} createUserDto User data
   * @returns {Promise<ResponseDto>} New user
   */
  async create(createUserDto: Prisma.UserCreateInput): Promise<ResponseDto> {
    const foundUser = await this.databaseService.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (foundUser) {
      throw new UnprocessableEntityException(
        'Email already exists. Please use a different email.',
      );
    }

    const passwordHash = await this.helperService.hashPassword(
      createUserDto.password,
    );
    const user = await this.databaseService.user.create({
      data: {
        ...createUserDto,
        password: passwordHash,
      },
    });

    return this.helperService.response(user, 201);
  }

  /**
   * Update one user
   * @param {number} id User id
   * @param {Prisma.UserUpdateInput} updateUserDto User data
   * @returns {Promise<ResponseDto>} Updated user
   */
  async update(
    id: string,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<ResponseDto> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pwd = JSON.parse(JSON.stringify(updateUserDto.password));

    const passwordHash = await this.helperService.hashPassword(pwd);
    const updatedUser = await this.databaseService.user.update({
      where: { id },
      data: { ...updateUserDto, password: passwordHash },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return this.helperService.response(result, 200);
  }

  /**
   * Delete one user
   * @param {string} id User id
   * @returns {Promise<ResponseDto>} Deleted user
   */
  async delete(id: string): Promise<ResponseDto> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.databaseService.user.delete({
      where: { id },
    });

    return this.helperService.response(null, 200);
  }
}
