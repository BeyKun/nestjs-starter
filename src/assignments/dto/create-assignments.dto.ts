import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: '4dba425a-e8b4-4154-ba6c-cc931c247b86',
    required: true,
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: '4dba425a-e8b4-4154-ba6c-cc931c247b86',
    required: true,
  })
  domainId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: '4dba425a-e8b4-4154-ba6c-cc931c247b86',
    required: true,
  })
  roleId: string;

  User: any;
  Domain: any;
  Role: any;
}
