import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class OrganizationResponse {
  @IsInt()
  @ApiProperty()
  organization_id: number;

  @IsInt()
  @ApiProperty()
  organization_type_id: number;

  @IsString()
  @ApiProperty()
  full_name: string;

  @IsString()
  @ApiProperty()
  short_name: string;

  @IsString()
  @ApiProperty()
  register_number: string;

  @IsString()
  @ApiProperty()
  phone: string;

  @IsEmail()
  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty()
  property_values?: number[];
}

export class StatusOrganizationResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrganizationResponse;
}
