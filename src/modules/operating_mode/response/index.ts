import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class OperatingModeResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  operating_mode_id: number

  @IsString()
  @ApiProperty()
  operating_mode_name: string
}

export class ArrayOperatingModeResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: OperatingModeResponse, isArray: true })
  data: OperatingModeResponse[]
}

export class StatusOperatingModeResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OperatingModeResponse
}
