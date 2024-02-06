import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class OrderStatusResponse {
  @IsInt()
  @ApiProperty()
  order_status_id: number;

  @IsString()
  @ApiProperty()
  order_status_name: string;
}

export class StatusOrderStatusResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrderStatusResponse;
}
