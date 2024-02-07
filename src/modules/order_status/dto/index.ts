import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class CreateOrderStatusDto {
  @ApiProperty()
  order_status_name: string
}

export class UpdateOrderStatusDto {
  @ApiProperty({ default: 1 })
  order_status_id: number

  @ApiProperty({ required: false })
  order_status_name?: string
}

export class OrderStatusSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  order_status_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  order_status_name?: string
}

export class OrderStatusFilters {
  @ApiProperty({ default: 1, required: false })
  order_status_id?: number

  @ApiProperty({ required: false })
  order_status_name?: string
}
