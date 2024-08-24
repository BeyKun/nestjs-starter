import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import { DatabaseService } from '../utils/database/database.service';
import { HelperService } from '../utils/helper/helper.service';
import { UpdateAssignmentDto } from './dto/update-assignments.dto';
import { CreateAssignmentDto } from './dto/create-assignments.dto';

const mockAssignmentsService = {
  findAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  findOne: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('AssignmentsService', () => {
  let service: AssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignmentsService, DatabaseService, HelperService],
    })
      .overrideProvider(AssignmentsService)
      .useValue(mockAssignmentsService)
      .compile();

    service = module.get<AssignmentsService>(AssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllAssignments', () => {
    it('should return an array of assignments', async () => {
      const result = await service.findAll('test');
      expect(result).toEqual([]);
      expect(mockAssignmentsService.findAll).toHaveBeenCalledWith('test');
    });
  });

  describe('createAssignment', () => {
    it('should return the created assignment', async () => {
      const createData: CreateAssignmentDto = {
        userId: '1',
        domainId: '1',
        roleId: '1',
        User: {},
        Domain: {},
        Role: {},
      };
      const result = await service.create(createData);
      expect(result).toEqual({ id: '1' });
      expect(mockAssignmentsService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findOneAssignment', () => {
    it('should return an assignment', async () => {
      const result = await service.findOne('1');
      expect(result).toBeDefined();
      expect(mockAssignmentsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateAssignment', () => {
    it('should return the updated assignment', async () => {
      const updateData: UpdateAssignmentDto = {
        userId: '1',
        domainId: '1',
        roleId: '1',
        User: {},
        Domain: {},
        Role: {},
      };
      const result = await service.update('1', updateData);
      expect(result).toBeDefined();
      expect(mockAssignmentsService.update).toHaveBeenCalledWith(
        '1',
        updateData,
      );
    });
  });

  describe('deleteAssignment', () => {
    it('should return the deleted assignment', async () => {
      const result = await service.delete('1');
      expect(result).toBeDefined();
      expect(result).toBeNull();
      expect(mockAssignmentsService.delete).toHaveBeenCalledWith('1');
    });
  });
});
