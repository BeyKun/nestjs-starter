import { Test, TestingModule } from '@nestjs/testing';
import { RoleSettingsController } from './role-settings.controller';
import { RoleSettingsService } from './role-settings.service';
import { CreateRoleSettingsDto } from './dto/create-role-settings.dto';
import { UpdateRoleSettingsDto } from './dto/update-role-settings.dto';

const mockRoleSettingsService = {
  findAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  findOne: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('RoleSettingsController', () => {
  let controller: RoleSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleSettingsController],
      providers: [RoleSettingsService],
    })
      .overrideProvider(RoleSettingsService)
      .useValue(mockRoleSettingsService)
      .compile();

    controller = module.get<RoleSettingsController>(RoleSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRoleSettings', () => {
    it('should create RoleSettings', async () => {
      const createData: CreateRoleSettingsDto = {
        roleId: 'test',
        moduleId: 'test',
        domainId: 'TEST',
        action: 'CREATE',
        isAllowed: true,
        Role: {},
        Module: {},
        Domain: {},
      };
      const result = await controller.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockRoleSettingsService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAllRoleSettingss', () => {
    it('should return array of RoleSettings', async () => {
      const result = await controller.findAll('test');
      expect(result).toEqual([]);
      expect(mockRoleSettingsService.findAll).toHaveBeenCalledWith('test');
    });
  });

  describe('findOneRoleSettings', () => {
    it('should return one RoleSettings', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual({ id: '1' });
      expect(mockRoleSettingsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateRoleSettings', () => {
    it('should update RoleSettings', async () => {
      const updateData: UpdateRoleSettingsDto = {
        roleId: 'test',
        moduleId: 'test',
        domainId: 'TEST',
        action: 'CREATE',
        isAllowed: false,
        Role: {},
        Module: {},
        Domain: {},
      };
      const result = await controller.update('1', updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockRoleSettingsService.update).toHaveBeenCalledWith(
        '1',
        updateData,
      );
    });
  });

  describe('deleteRoleSettings', () => {
    it('should delete RoleSettings', async () => {
      const result = await controller.delete('1');
      expect(result).toBeNull();
      expect(mockRoleSettingsService.delete).toHaveBeenCalledWith('1');
    });
  });
});
