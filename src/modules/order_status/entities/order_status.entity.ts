import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Order } from 'src/modules/order/entities/order.entity'

@Table
export class OrderStatus extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  order_status_id: number

  @ApiProperty({ example: AppStrings.ORDER_STATUS_NAME_EXAMPLE, description: AppStrings.ORDER_STATUS_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false })
  order_status_name: string

  @HasMany(() => Order, OrderStatus.primaryKeyAttribute)
  orders: NonAttribute<Order[]>
}
