import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class PeriodicityResponse {
  @IsString()
  @ApiProperty()
  periodicity_id: number

  @IsString()
  @ApiProperty()
  periodicity_name: string
}

export class ArrayPeriodicityResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: PeriodicityResponse, isArray: true })
  data: PeriodicityResponse[]
}

export class StatusPeriodicityResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: PeriodicityResponse
}
