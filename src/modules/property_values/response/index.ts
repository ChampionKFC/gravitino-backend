import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsInt, IsOptional, IsArray } from 'class-validator'

export class PropertyValueResponse {
  @IsInt()
  @ApiProperty()
  property_value_id: number

  @IsInt()
  @ApiProperty()
  property_name_id: number

  @IsString()
  @ApiProperty()
  property_value: string
}

export class ArrayPropertyValueResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: PropertyValueResponse, isArray: true })
  data: PropertyValueResponse[]
}

export class StatusPropertValueResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: PropertyValueResponse
}
