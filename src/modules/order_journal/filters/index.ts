import { ApiProperty } from '@nestjs/swagger'
import { FilterOffset } from 'src/common/classes/filter_offset'
import { AppStrings } from 'src/common/constants/strings'
import { OrderStatusFilters, OrderStatusSorts } from 'src/modules/order_status/dto'
import { UserFilters, UserSorts } from 'src/modules/users/filters'

export class OrderJournalFilters {
  @ApiProperty({ default: 1, required: false })
  order_journal_id?: number

  @ApiProperty({ required: false })
  user?: UserFilters

  @ApiProperty({ default: 1, required: false })
  order_id?: number

  @ApiProperty({ required: false })
  order_status?: OrderStatusFilters

  @ApiProperty({ required: false })
  comment?: string

  @ApiProperty({ required: false })
  changed_field?: string

  @ApiProperty({ required: false })
  old_value?: string

  @ApiProperty({ required: false })
  new_value?: string
}

export class OrderJournalSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  order_journal_id?: string

  @ApiProperty({ required: false })
  user?: UserSorts

  @ApiProperty({ default: AppStrings.ASC, required: false })
  order_id?: string

  @ApiProperty({ required: false })
  order_status?: OrderStatusSorts

  @ApiProperty({ default: AppStrings.ASC, required: false })
  comment?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  changed_field?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  old_value?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  new_value?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  createdAt?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  updatedAt?: string
}

export class OrderJournalFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset

  @ApiProperty({ required: false })
  filter?: OrderJournalFilters

  @ApiProperty({ required: false })
  sorts?: OrderJournalSorts
}
