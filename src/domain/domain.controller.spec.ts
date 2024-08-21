import { Test, TestingModule } from '@nestjs/testing';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

const mockDomainService = {
  findAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  findOne: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('DomainController', () => {
  let controller: DomainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomainController],
      providers: [DomainService],
    })
      .overrideProvider(DomainService)
      .useValue(mockDomainService)
      .compile();

    controller = module.get<DomainController>(DomainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDomain', () => {
    it('should create domain', async () => {
      const createData: CreateDomainDto = {
        name: 'test',
        description: 'test',
        parent_id: null,
      };
      const result = await controller.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockDomainService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAllDomains', () => {
    it('should return array of domains', async () => {
      const result = await controller.findAll('1.1.1.1', 'test');
      expect(result).toEqual([]);
      expect(mockDomainService.findAll).toHaveBeenCalledWith('test');
    });
  });

  describe('findOneDomain', () => {
    it('should return one domain', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual({ id: '1' });
      expect(mockDomainService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateDomain', () => {
    it('should update domain', async () => {
      const updateData: UpdateDomainDto = {
        name: 'test',
        description: 'test',
        parent_id: null,
      };
      const result = await controller.update('1', updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockDomainService.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteDomain', () => {
    it('should delete domain', async () => {
      const result = await controller.delete('1');
      expect(result).toBeNull();
      expect(mockDomainService.delete).toHaveBeenCalledWith('1');
    });
  });
});
