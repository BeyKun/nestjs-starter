import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleSettingsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: 'Nama Module',
    required: true,
  })
  roleId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'lorem ipsum dolor set',
    required: true,
  })
  domainId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'NAMA_MODULE',
    required: false,
  })
  moduleId: string;

  @IsEnum(['CREATE', 'UPDATE', 'DELETE', 'READ'])
  @IsOptional()
  @ApiProperty({
    example: 'CREATE | UPDATE | DELETE | READ',
    required: false,
  })
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    required: true,
  })
  isAllowed: boolean;

  Role: any;
  Module: any;
  Domain: any;
}
