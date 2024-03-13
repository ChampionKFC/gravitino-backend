import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDate, IsInt, IsOptional, IsString } from 'class-validator'

export class OrderResponse {
  @IsInt()
  @ApiProperty({ default: 1, required: false })
  order_id?: number

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  task_id?: number

  @IsString()
  @ApiProperty({ required: false })
  order_name?: string

  @IsString()
  @ApiProperty({ required: false })
  order_description?: string

  @IsInt()
  @ApiProperty({ default: 1 })
  facility_id: number

  @IsInt()
  @ApiProperty({ default: 1 })
  executor_id: number

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  completed_by?: number

  @IsInt()
  @ApiProperty({ default: 1 })
  creator_id: number

  @IsInt()
  @ApiProperty({ default: 1 })
  order_status_id: number

  @IsDate()
  @ApiProperty()
  planned_datetime: Date

  @IsDate()
  @ApiProperty()
  task_end_datetime: Date

  @IsDate()
  @ApiProperty({ required: false })
  ended_at_datetime?: Date

  @IsDate()
  @ApiProperty({ required: false })
  closed_at_datetime?: Date

  @IsInt()
  @ApiProperty({ default: 1 })
  priority_id: number

  @ApiProperty({ required: false })
  property_values?: number[]

  @ApiProperty({ required: false })
  files?: string[]
}

export class ArrayOrderResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: OrderResponse, isArray: true })
  data: OrderResponse[]
}

export class StatusOrderResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrderResponse
}

export class StatusArrayOrderResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: ArrayOrderResponse
}
