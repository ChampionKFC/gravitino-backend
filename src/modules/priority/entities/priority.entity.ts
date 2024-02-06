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
export class OrderPriority extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  priority_id: number;

  @ApiProperty({ example: 'Ежедневно', description: 'Название приоритета' })
  @Column({ type: DataType.STRING(30), allowNull: false })
  priority_name: string;

  @HasMany(() => Order, 'priority_id')
  orders: NonAttribute<Order[]>;
}
