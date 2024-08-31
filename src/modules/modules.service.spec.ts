import { Test, TestingModule } from '@nestjs/testing';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

const mockModulesService = {
  findAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  findOne: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('ModulesService', () => {
  let service: ModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModulesService],
    })
      .overrideProvider(ModulesService)
      .useValue(mockModulesService)
      .compile();

    service = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createModules', () => {
    it('should create Modules', async () => {
      const createData: CreateModuleDto = {
        name: 'test',
        description: 'test',
        constant: 'TEST',
      };
      const result = await service.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockModulesService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAllModuless', () => {
    it('should return array of Modules', async () => {
      const result = await service.findAll('test');
      expect(result).toEqual([]);
      expect(mockModulesService.findAll).toHaveBeenCalledWith('test');
    });
  });

  describe('findOneModules', () => {
    it('should return one Modules', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1' });
      expect(mockModulesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateModules', () => {
    it('should update Modules', async () => {
      const updateData: UpdateModuleDto = {
        name: 'test',
        description: 'test',
        constant: 'TEST',
      };
      const result = await service.update('1', updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockModulesService.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteModules', () => {
    it('should delete Modules', async () => {
      const result = await service.delete('1');
      expect(result).toBeNull();
      expect(mockModulesService.delete).toHaveBeenCalledWith('1');
    });
  });
});
