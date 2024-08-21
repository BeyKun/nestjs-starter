import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserService = {
    create: jest.fn().mockResolvedValue({ id: '1' }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ id: '1' }),
    delete: jest.fn().mockResolvedValue(null),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user', async () => {
      const createData: CreateUserDto = {
        name: 'test',
        email: 'test@mail.com',
        password: 'test',
      };
      const result = await service.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockUserService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      const id = '1';
      const result = await service.findOne(id);
      expect(result).toEqual({ id: '1' });
      expect(mockUserService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const id = '1';
      const updateData: UpdateUserDto = {
        name: 'test',
        email: 'test@mail.com',
      };
      const result = await service.update(id, updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockUserService.update).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const id = '1';
      const result = await service.delete(id);
      expect(result).toEqual(null);
      expect(mockUserService.delete).toHaveBeenCalledWith(id);
    });
  });
});
