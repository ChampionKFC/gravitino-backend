import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

export class CreatePropertyNameDto {
  @IsString()
  @ApiProperty()
  property_name: string

  @IsString()
  @ApiProperty()
  entity_name: string
}

export class UpdatePropertyNameDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({ default: 1 })
  property_name_id: number

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  property_name?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  entity_name?: string
}

export class CreatePropertyDto {
  @IsString()
  @ApiProperty()
  property_name: string

  @IsArray()
  @ApiProperty({ default: [] })
  property_values: string[]

  @IsString()
  @ApiProperty()
  entity_name: string
}

export class UpdatePropertyDto {
  @IsInt()
  @ApiProperty()
  property_name_id: number

  @IsString()
  @ApiProperty()
  property_name: string

  @IsArray()
  @ApiProperty({ default: [] })
  property_values: string[]

  @IsString()
  @ApiProperty()
  entity_name: string
}
