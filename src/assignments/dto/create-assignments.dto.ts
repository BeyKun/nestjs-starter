import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: '4dba425a-e8b4-4154-ba6c-cc931c247b86',
    required: true,
  })
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: '4dba425a-e8b4-4154-ba6c-cc931c247b86',
    required: true,
  })
  domain_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ADMIN | INTERN | ENGINEER',
    required: true,
  })
  @IsEnum(['INTERN', 'ENGINEER', 'ADMIN'], {
    message: 'Valid role required',
  })
  role: 'INTERN' | 'ENGINEER' | 'ADMIN';

  user: any;
  domain: any;
}
