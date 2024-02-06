import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/modules/order/entities/order.entity';

@Table
export class OrderStatus extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  order_status_id: number;

  @ApiProperty({ example: 'Выполнено', description: 'Статус заказа' })
  @Column({ type: DataType.STRING(30), allowNull: false })
  order_status_name: string;

  @HasMany(() => Order, 'order_status_id')
  orders: NonAttribute<Order[]>;
}