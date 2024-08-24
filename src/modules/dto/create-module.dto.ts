import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: 'Nama Module',
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
    example: 'NAMA_MODULE',
    required: false,
  })
  constant: string;
}
