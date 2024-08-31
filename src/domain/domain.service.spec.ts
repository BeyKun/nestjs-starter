import { Test, TestingModule } from '@nestjs/testing';
import { DomainService } from './domain.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

describe('DomainService', () => {
  let service: DomainService;
  const mockDomainService = {
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: '1' }),
    findOne: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ id: '1' }),
    delete: jest.fn().mockResolvedValue(null),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainService],
    })
      .overrideProvider(DomainService)
      .useValue(mockDomainService)
      .compile();

    service = module.get<DomainService>(DomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDomain', () => {
    it('should create domain', async () => {
      const createData: CreateDomainDto = {
        name: 'test',
        description: 'test',
        parentId: null,
      };
      const result = await service.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockDomainService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAllDomains', () => {
    it('should return array of domains', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(mockDomainService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOneDomain', () => {
    it('should return one domain', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1' });
      expect(mockDomainService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateDomain', () => {
    it('should return updated domain', async () => {
      const updateData: UpdateDomainDto = {
        name: 'test2',
        description: 'test2',
        parentId: null,
      };
      const result = await service.update('1', updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockDomainService.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteDomain', () => {
    it('should remove domain', async () => {
      const result = await service.delete('1');
      expect(result).toBeNull();
      expect(mockDomainService.delete).toHaveBeenCalledWith('1');
    });
  });
});
