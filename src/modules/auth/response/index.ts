import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class AuthResponse {
  @IsString()
  @ApiProperty()
  refreshToken: string;

  @IsString()
  @ApiProperty()
  accessToken: string;
}

export class StatusAuthResponseResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;
}
