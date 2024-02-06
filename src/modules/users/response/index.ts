import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsPhoneNumber,
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UserResponse {
  @IsInt()
  @ApiProperty({ required: false })
  user_id?: number;

  @IsString()
  @ApiProperty({ required: false })
  first_name?: string;

  @IsString()
  @ApiProperty({ required: false })
  patronymic?: string;

  @IsPhoneNumber()
  @ApiProperty({ required: false })
  phone?: string;

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  person_id?: number;

  @IsInt()
  @ApiProperty({ default: 1 })
  role_id: number;

  @ApiProperty({ default: 1, required: false })
  organization_id?: number;

  @ApiProperty({ default: 1, required: false })
  group_id?: number;

  @ApiProperty({ default: true })
  is_active: boolean;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  property_values?: number[];
}

export class StatusUserResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: UserResponse;
}
