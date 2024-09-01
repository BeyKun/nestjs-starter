import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTrashDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: '22291851-b71b-4dd2-b8ba-f10b95577e10',
    required: true,
  })
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: '22291851-b71b-4dd2-b8ba-f10b95577e10',
    required: true,
  })
  moduleDataId: string;

  @IsOptional()
  data: string;
  User: any;
  Module: any;
}
