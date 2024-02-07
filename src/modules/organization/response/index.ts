import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class OrganizationResponse {
  @IsInt()
  @ApiProperty()
  organization_id: number

  @IsInt()
  @ApiProperty()
  organization_type_id: number

  @IsString()
  @ApiProperty()
  full_name: string

  @IsString()
  @ApiProperty()
  short_name: string

  @IsString()
  @ApiProperty()
  phone: string

  @ApiProperty()
  property_values?: number[]
}

export class StatusOrganizationResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrganizationResponse
}
