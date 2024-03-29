import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsInt, IsOptional, IsArray } from 'class-validator'

export class OrderStatusResponse {
  @IsInt()
  @ApiProperty()
  order_status_id: number

  @IsString()
  @ApiProperty()
  order_status_name: string
}

export class ArrayOrderStatusResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: OrderStatusResponse, isArray: true })
  data: OrderStatusResponse[]
}

export class StatusOrderStatusResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrderStatusResponse
}
