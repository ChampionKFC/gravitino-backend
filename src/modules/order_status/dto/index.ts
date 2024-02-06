import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderStatusDto {
  @ApiProperty()
  order_status_name: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ default: 1 })
  order_status_id: number;

  @ApiProperty({ required: false })
  order_status_name?: string;
}

export class OrderStatusSorts {
  @ApiProperty({ default: 'ASC', required: false })
  order_status_id?: string;

  @ApiProperty({ default: 'ASC', required: false })
  order_status_name?: string;
}

export class OrderStatusFilters {
  @ApiProperty({ default: 1, required: false })
  order_status_id?: number;

  @ApiProperty({ required: false })
  order_status_name?: string;
}