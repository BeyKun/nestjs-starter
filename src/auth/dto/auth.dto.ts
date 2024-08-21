import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthPayloadDto {
  @ApiProperty({ example: 'test@mail.com', required: true })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'test123', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
