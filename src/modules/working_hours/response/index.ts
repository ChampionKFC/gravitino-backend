import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class WorkingHoursResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  working_hours_id: number

  @IsString()
  @ApiProperty()
  working_hours_name: string
}

export class ArrayWorkingHoursResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: WorkingHoursResponse, isArray: true })
  data: WorkingHoursResponse[]
}

export class StatusWorkingHoursResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: WorkingHoursResponse
}
