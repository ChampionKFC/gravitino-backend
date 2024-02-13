import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsOptional, IsInt, IsArray } from 'class-validator'

export class FacilityTypeResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  facility_type_id: number

  @IsString()
  @ApiProperty()
  facility_type_name: string
}

export class ArrayFacilityTypeResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: FacilityTypeResponse, isArray: true })
  data: FacilityTypeResponse[]
}

export class StatusFacilityTypeResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: FacilityTypeResponse
}
