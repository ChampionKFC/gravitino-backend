import { ApiProperty } from '@nestjs/swagger'
import { PrimaryKey, Column, DataType, ForeignKey, BelongsTo, Table, Model } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Order } from 'src/modules/order/entities/order.entity'
import { OrderStatus } from 'src/modules/order_status/entities/order_status.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Table
export class OrderJournal extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  order_journal_id: number

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number

  @ApiProperty({
    type: () => User,
    description: AppStrings.USER_HISTORY,
  })
  @BelongsTo(() => User)
  user: User

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  order_id: number

  @ApiProperty({
    type: () => Order,
    description: AppStrings.ORDER,
  })
  @BelongsTo(() => Order, { onDelete: AppStrings.CASCADE, onUpdate: AppStrings.CASCADE })
  order: Order

  @ForeignKey(() => OrderStatus)
  @Column({ type: DataType.INTEGER, allowNull: false })
  order_status_id: number

  @ApiProperty({
    type: () => OrderStatus,
    description: AppStrings.ORDER_STATUS,
  })
  @BelongsTo(() => OrderStatus)
  order_status: OrderStatus

  @ApiProperty({
    example: AppStrings.ORDER_JOURNAL_COMMENT_EXAMPLE,
    description: AppStrings.ORDER_JOURNAL_COMMENT_DESCRIPTION,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  comment: string

  @ApiProperty({
    example: AppStrings.ORDER_JOURNAL_FIELD_EXAMPLE,
    description: AppStrings.ORDER_JOURNAL_FIELD_DESCRIPTION,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  changed_field?: string

  @ApiProperty({
    example: AppStrings.ORDER_JOURNAL_OLD_VALUE_EXAMPLE,
    description: AppStrings.ORDER_JOURNAL_OLD_VALUE_DESCRIPTION,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  old_value?: string

  @ApiProperty({
    example: AppStrings.ORDER_JOURNAL_NEW_VALUE_EXAMPLE,
    description: AppStrings.ORDER_JOURNAL_NEW_VALUE_DESCRIPTION,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  new_value?: string
}
