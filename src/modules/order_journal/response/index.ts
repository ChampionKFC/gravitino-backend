import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class OrderJournalResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  order_journal_id: number

  @IsInt()
  @ApiProperty({ default: 1 })
  user_id: number

  @IsInt()
  @ApiProperty({ default: 1 })
  order_id: number

  @IsInt()
  @ApiProperty({ default: 1 })
  order_status_id: number

  @IsString()
  @ApiProperty()
  comment: string

  @IsString()
  @ApiProperty({ required: false })
  changed_field?: string

  @IsString()
  @ApiProperty({ required: false })
  old_value?: string

  @IsString()
  @ApiProperty({ required: false })
  new_value?: string
}

export class ArrayOrderJournalResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: OrderJournalResponse, isArray: true })
  data: OrderJournalResponse[]
}

export class StatusOrderJournalResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: OrderJournalResponse
}
