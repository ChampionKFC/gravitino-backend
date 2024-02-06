import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { OrderStatusFilters, OrderStatusSorts } from '../dto';

export class OrderStatusFilter {
  @ApiProperty({ default: true })
  offset?: FilterOffset;

  @ApiProperty({ default: true })
  filter?: OrderStatusFilters;

  @ApiProperty({ default: true })
  sorts?: OrderStatusSorts;
}
