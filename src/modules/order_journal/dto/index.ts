import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderJournalDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  order_id: number;

  @ApiProperty()
  order_status_id: number;

  @ApiProperty()
  comment: string;

  @ApiProperty({ required: false })
  changed_field?: string;

  @ApiProperty({ required: false })
  old_value?: string;

  @ApiProperty({ required: false })
  new_value?: string;
}

export class UpdateOrderJournalDto {
  @ApiProperty()
  order_journal_id: number;

  @ApiProperty({ required: false })
  user_id?: number;

  @ApiProperty({ required: false })
  order_id?: number;

  @ApiProperty({ required: false })
  order_status_id?: number;

  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty({ required: false })
  changed_field?: string;

  @ApiProperty({ required: false })
  old_value?: string;

  @ApiProperty({ required: false })
  new_value?: string;
}
