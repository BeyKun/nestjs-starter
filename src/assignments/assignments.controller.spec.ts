import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignments.dto';
import { UpdateAssignmentDto } from './dto/update-assignments.dto';

const mockAssignmentsService = {
  findAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  delete: jest.fn().mockResolvedValue(null),
};

describe('AssignmentsController', () => {
  let controller: AssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [AssignmentsService],
    })
      .overrideProvider(AssignmentsService)
      .useValue(mockAssignmentsService)
      .compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of assignments', async () => {
      const result = await controller.findAll('test');
      expect(result).toEqual([]);
      expect(mockAssignmentsService.findAll).toHaveBeenCalledWith('test');
    });
  });

  describe('create', () => {
    it('should return the created assignment', async () => {
      const createData: CreateAssignmentDto = {
        user_id: '1',
        domain_id: '1',
        role: 'ADMIN',
        user: {},
        domain: {},
      };
      const result = await controller.create(createData);
      expect(result).toBeNull();
      expect(mockAssignmentsService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findOne', () => {
    it('should return an assignment', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual({ id: '1' });
      expect(mockAssignmentsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should return an assignment', async () => {
      const updateData: UpdateAssignmentDto = {
        user: {},
        domain: {},
        role: 'ADMIN',
      };
      const result = await controller.update('1', updateData);
      expect(result).toEqual({ id: '1' });
      expect(mockAssignmentsService.update).toHaveBeenCalledWith(
        '1',
        updateData,
      );
    });
  });

  describe('delete', () => {
    it('should return null', async () => {
      const result = await controller.delete('1');
      expect(result).toBeNull();
      expect(mockAssignmentsService.delete).toHaveBeenCalledWith('1');
    });
  });
});
