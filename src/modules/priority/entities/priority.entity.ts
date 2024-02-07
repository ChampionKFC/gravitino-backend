import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Order } from 'src/modules/order/entities/order.entity'

@Table
export class OrderPriority extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  priority_id: number

  @ApiProperty({ example: AppStrings.PRIORITY_NAME_EXAMPLE, description: AppStrings.PRIORITY_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false })
  priority_name: string

  @HasMany(() => Order, OrderPriority.primaryKeyAttribute)
  orders: NonAttribute<Order[]>
}
