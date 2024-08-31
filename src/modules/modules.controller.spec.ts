import { Test, TestingModule } from '@nestjs/testing';
import { ModulesController } from './modules.controller';
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

describe('ModulesController', () => {
  let controller: ModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
      providers: [ModulesService],
    })
      .overrideProvider(ModulesService)
      .useValue(mockModulesService)
      .compile();

    controller = module.get<ModulesController>(ModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createModules', () => {
    it('should create Modules', async () => {
      const createData: CreateModuleDto = {
        name: 'test',
        description: 'test',
        constant: 'TEST',
      };
      const result = await controller.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockModulesService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAllModuless', () => {
    it('should return array of Modules', async () => {
      const result = await controller.findAll('test');
      expect(result).toEqual([]);
      expect(mockModulesService.findAll).toHaveBeenCalledWith('test');
    });
  });

  describe('findOneModules', () => {
    it('should return one Modules', async () => {
      const result = await controller.findOne('1');
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
      const result = await controller.update('1', updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockModulesService.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteModules', () => {
    it('should delete Modules', async () => {
      const result = await controller.delete('1');
      expect(result).toBeNull();
      expect(mockModulesService.delete).toHaveBeenCalledWith('1');
    });
  });
});
