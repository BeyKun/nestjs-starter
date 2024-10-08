import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: 'Main Domain',
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'lorem ipsum dolor set',
    required: true,
  })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '4dba425a-e8b4-4154-ba6c-cc931c247b86',
    required: false,
  })
  parentId: string;
}
