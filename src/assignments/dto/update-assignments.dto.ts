import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './create-assignments.dto';

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {}