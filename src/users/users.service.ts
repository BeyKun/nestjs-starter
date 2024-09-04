import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { ResponseDto } from '../utils/dto/response.dto';
import { Prisma } from '@prisma/client';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Equal, ILike, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helperService: HelperService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Get all users
   * @param {string} [search] - Optional search query to filter users by name
   * @returns {Promise<ResponseDto>} Array of users
   */
  async findAll(search?: string): Promise<ResponseDto> {
    let users = [];
    console.log(search);
    if (search) {
      users = await this.userRepository.findBy({
        name: ILike(`%${search}%`),
      });
      console.log(users);
    } else {
      users = await this.userRepository.find();
    }

    return this.helperService.response(users, 200);
  }

  /**
   * Get one user by id
   * @param {number} id User id
   * @returns {Promise<ResponseDto>} User
   */
  async findOne(id: string): Promise<ResponseDto> {
    const user = await this.userRepository.findOneByOrFail({
      id: Equal(id),
    });

    return this.helperService.response(user, 200);
  }

  /**
   * Create new user
   * @param {Prisma.UserCreateInput} createUserDto User data
   * @returns {Promise<ResponseDto>} New user
   */
  async create(createUserDto: Prisma.UserCreateInput): Promise<ResponseDto> {
    const foundUser = await this.userRepository.findOne({
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

    const user = await this.userRepository.save({
      ...createUserDto,
      password: passwordHash,
    });

    return this.helperService.response(user, 201);
  }

  /**
   * Update one user
   * @param {number} id User id
   * @param {Prisma.UserUpdateInput} updateUserDto User data
   * @returns {Promise<ResponseDto>} Updated user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto> {
    const user = await this.userRepository.findOneByOrFail({
      id: Equal(id),
    });

    if (user.email !== updateUserDto.email) {
      const checkEmail = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (checkEmail) {
        throw new UnprocessableEntityException(
          'Email already exists. Please use a different email.',
        );
      }
    }

    const result = await this.userRepository
      .createQueryBuilder()
      .update(UserEntity, updateUserDto)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    return this.helperService.response(result.raw[0], 200);
  }

  /**
   * Delete one user
   * @param {string} id User id
   * @returns {Promise<ResponseDto>} Deleted user
   */
  async delete(id: string): Promise<ResponseDto> {
    await this.userRepository.findOneByOrFail({
      id: Equal(id),
    });

    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('id = :id', { id: id })
      .execute();

    return this.helperService.response(null, 200);
  }
}
