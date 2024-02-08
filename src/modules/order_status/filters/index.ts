import { ApiProperty } from '@nestjs/swagger'
import { FilterOffset } from 'src/common/classes/filter_offset'
import { OrderStatusFilters, OrderStatusSorts } from '../dto'

export class OrderStatusFilter {
  @ApiProperty()
  offset?: FilterOffset

  @ApiProperty()
  filter?: OrderStatusFilters

  @ApiProperty()
  sorts?: OrderStatusSorts
}
