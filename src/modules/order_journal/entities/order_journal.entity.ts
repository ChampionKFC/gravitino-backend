import { ApiProperty } from '@nestjs/swagger'
import { PrimaryKey, Column, DataType, ForeignKey, BelongsTo, Table, Model } from 'sequelize-typescript'
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
    description: 'Пользовтель выполнивший действие',
  })
  @BelongsTo(() => User)
  user: User

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  order_id: number

  @ApiProperty({
    type: () => Order,
    description: 'Заказ',
  })
  @BelongsTo(() => Order, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  order: Order

  @ForeignKey(() => OrderStatus)
  @Column({ type: DataType.INTEGER, allowNull: false })
  order_status_id: number

  @ApiProperty({
    type: () => OrderStatus,
    description: 'Статус заказа',
  })
  @BelongsTo(() => OrderStatus)
  order_status: OrderStatus

  @ApiProperty({
    example: 'Изменен статус',
    description: 'Название действия',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  comment: string

  @ApiProperty({
    example: 'order_name',
    description: 'Измененное поле',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  changed_field?: string

  @ApiProperty({
    example: 'Заказ №1',
    description: 'Старое значение',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  old_value?: string

  @ApiProperty({
    example: 'Заказ №2',
    description: 'Новое значение',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  new_value?: string
}
