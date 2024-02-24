import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator'

export class TransactionHistoryResponse {
  @IsInt()
  @ApiProperty()
  history_id: number

  @IsInt()
  @ApiProperty()
  user_id: number

  @IsString()
  @ApiProperty()
  comment: string
}

export class ArrayTransactionHistoryResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: TransactionHistoryResponse, isArray: true })
  data: TransactionHistoryResponse[]
}

export class StatusTransactionHistoryResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean
}
