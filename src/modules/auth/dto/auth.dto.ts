import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @ApiProperty({ default: 'user1@mail.com' })
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}
