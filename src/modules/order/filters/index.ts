import { ApiProperty } from '@nestjs/swagger';
import { OrderFilters, OrderSorts } from '../dto';
import { FilterOffset } from 'src/common/classes/filter_offset';

export class OrderFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: OrderFilters;

  @ApiProperty({ required: false })
  sorts?: OrderSorts;
}

class OrderPeriod {
  @ApiProperty()
  date_start: Date;

  @ApiProperty()
  date_end: Date;
}

export class MyOrdersFilter {
  @ApiProperty()
  offset?: FilterOffset;

  @ApiProperty()
  filter?: OrderFilters;

  @ApiProperty()
  sorts?: OrderSorts;

  @ApiProperty()
  period: OrderPeriod;
}
