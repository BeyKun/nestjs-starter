import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { CreateRolesDto } from './dto/create-Roles.dto';
import { UpdateRolesDto } from './dto/update-Roles.dto';

const mockRolesService = {
  findAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  findOne: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService],
    })
      .overrideProvider(RolesService)
      .useValue(mockRolesService)
      .compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRoles', () => {
    it('should create Roles', async () => {
      const createData: CreateRolesDto = {
        name: 'test',
        description: 'test',
      };
      const result = await service.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockRolesService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAllRoless', () => {
    it('should return array of Roles', async () => {
      const result = await service.findAll('test');
      expect(result).toEqual([]);
      expect(mockRolesService.findAll).toHaveBeenCalledWith('test');
    });
  });

  describe('findOneRoles', () => {
    it('should return one Roles', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1' });
      expect(mockRolesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateRoles', () => {
    it('should update Roles', async () => {
      const updateData: UpdateRolesDto = {
        name: 'test',
        description: 'test',
      };
      const result = await service.update('1', updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockRolesService.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteRoles', () => {
    it('should delete Roles', async () => {
      const result = await service.delete('1');
      expect(result).toBeNull();
      expect(mockRolesService.delete).toHaveBeenCalledWith('1');
    });
  });
});
