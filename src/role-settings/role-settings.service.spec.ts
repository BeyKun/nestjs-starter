import { Test, TestingModule } from '@nestjs/testing';
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

describe('RoleSettingsService', () => {
  let service: RoleSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleSettingsService],
    })
      .overrideProvider(RoleSettingsService)
      .useValue(mockRoleSettingsService)
      .compile();

    service = module.get<RoleSettingsService>(RoleSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      const result = await service.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockRoleSettingsService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAllRoleSettingss', () => {
    it('should return array of RoleSettings', async () => {
      const result = await service.findAll('test');
      expect(result).toEqual([]);
      expect(mockRoleSettingsService.findAll).toHaveBeenCalledWith('test');
    });
  });

  describe('findOneRoleSettings', () => {
    it('should return one RoleSettings', async () => {
      const result = await service.findOne('1');
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
      const result = await service.update('1', updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockRoleSettingsService.update).toHaveBeenCalledWith(
        '1',
        updateData,
      );
    });
  });

  describe('deleteRoleSettings', () => {
    it('should delete RoleSettings', async () => {
      const result = await service.delete('1');
      expect(result).toBeNull();
      expect(mockRoleSettingsService.delete).toHaveBeenCalledWith('1');
    });
  });
});
