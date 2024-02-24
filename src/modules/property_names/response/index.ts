import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsInt, IsOptional, IsArray } from 'class-validator'

export class PropertyNameResponse {
  @IsInt()
  @ApiProperty()
  property_name_id: number

  @IsString()
  @ApiProperty()
  property_name: string

  @IsString()
  @ApiProperty()
  entity_name: string
}

export class ArrayPropertyNameResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: PropertyNameResponse, isArray: true })
  data: PropertyNameResponse[]
}

export class StatusPropertyNameResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: PropertyNameResponse
}
