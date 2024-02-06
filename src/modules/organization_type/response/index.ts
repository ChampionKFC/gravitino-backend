import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class OrganizationTypeResponse {
  @IsInt()
  @ApiProperty()
  organization_type_id: number;

  @IsString()
  @ApiProperty()
  organization_type_name: string;
}

export class StatusOrganizationTypeResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrganizationTypeResponse;
}
