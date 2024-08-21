import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUserService = {
  create: jest.fn().mockResolvedValue({
    id: '1',
  }),
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
  }),
  update: jest.fn().mockResolvedValue({
    id: '1',
  }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create user', async () => {
      const createData: CreateUserDto = {
        name: 'test',
        email: 'test@mail.com',
        password: 'test',
      };
      const result = await controller.create(createData);
      expect(result).toEqual({
        id: '1',
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      const id = '1';
      const result = await controller.findOne(id);
      expect(result).toEqual({
        id: '1',
      });
      expect(mockUserService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const id = '1';
      const updateData: UpdateUserDto = {
        name: 'test2',
        email: 'test2@mail.com',
      };
      const result = await controller.update(id, updateData);
      expect(result).toEqual({
        id: '1',
      });
      expect(mockUserService.update).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const id = '1';
      const result = await controller.delete(id);
      expect(result).toBeNull();
      expect(mockUserService.delete).toHaveBeenCalledWith(id);
    });
  });
});
