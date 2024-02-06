import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionHistoryDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  comment: string;
}

export class UpdateTransactionHistoryDto {
  @ApiProperty()
  history_id: number;

  @ApiProperty({ required: false })
  user_id?: number;

  @ApiProperty({ required: false })
  comment?: string;
}
