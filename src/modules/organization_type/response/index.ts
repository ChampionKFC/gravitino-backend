import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class OrganizationTypeResponse {
  @IsInt()
  @ApiProperty()
  organization_type_id: number

  @IsString()
  @ApiProperty()
  organization_type_name: string
}

export class ArrayOrganizationTypeResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: OrganizationTypeResponse, isArray: true })
  data: OrganizationTypeResponse[]
}

export class StatusOrganizationTypeResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrganizationTypeResponse
}
