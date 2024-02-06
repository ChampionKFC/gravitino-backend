import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { OrderPriorityFilters, OrderPrioritySorts } from '../dto';

export class OrderPriorityFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: OrderPriorityFilters;

  @ApiProperty({ required: false })
  sorts?: OrderPrioritySorts;
}
