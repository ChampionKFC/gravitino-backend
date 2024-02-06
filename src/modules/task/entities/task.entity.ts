import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/modules/category/entities/category.entity';
import { CategoryResponse } from 'src/modules/category/response';
import { Order } from 'src/modules/order/entities/order.entity';
import { Periodicity } from 'src/modules/periodicity/entities/periodicity.entity';
import { PeriodicityResponse } from 'src/modules/periodicity/response';

@Table
export class Task extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  task_id: number;

  @ApiProperty({
    example: 'Уборка снега',
    description: 'Название задачи',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  task_name: string;

  @ApiProperty({
    example: 'Уборка снега перед входом',
    description: 'Описание задачи',
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  task_description?: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  category_id: number;

  @ApiProperty({
    type: () => Task,
    example: CategoryResponse,
    description: 'Категория задачи',
  })
  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Periodicity)
  @Column({ type: DataType.INTEGER, allowNull: false })
  periodicity_id: number;

  @ApiProperty({
    type: () => Periodicity,
    example: PeriodicityResponse,
    description: 'Периодичность задачи',
  })
  @BelongsTo(() => Periodicity)
  periodicity: Periodicity;

  @ApiProperty({
    example: '01.01.2024',
    description: 'Начало периода',
  })
  @Column({ type: DataType.DATEONLY, allowNull: false })
  period_start: Date;

  @ApiProperty({
    example: '31.12.2024',
    description: 'Конец периода',
  })
  @Column({ type: DataType.DATEONLY, allowNull: false })
  period_end: Date;

  @HasMany(() => Order, 'task_id')
  orders: NonAttribute<Order[]>;
}
