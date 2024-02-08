import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class OrderPriorityResponse {
  @IsInt()
  @ApiProperty()
  priority_id: number

  @IsString()
  @ApiProperty()
  priority_name: string
}

export class ArrayOrderPriorityResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: OrderPriorityResponse, isArray: true })
  data: OrderPriorityResponse[]
}

export class StatusOrderPriorityResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrderPriorityResponse
}
