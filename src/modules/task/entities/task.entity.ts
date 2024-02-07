import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Category } from 'src/modules/category/entities/category.entity'
import { CategoryResponse } from 'src/modules/category/response'
import { Order } from 'src/modules/order/entities/order.entity'
import { Periodicity } from 'src/modules/periodicity/entities/periodicity.entity'
import { PeriodicityResponse } from 'src/modules/periodicity/response'

@Table
export class Task extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  task_id: number

  @ApiProperty({
    example: AppStrings.TASK_NAME_EXAMPLE,
    description: AppStrings.TASK_NAME_DESCRIPTION,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  task_name: string

  @ApiProperty({
    example: AppStrings.TASK_DESC_EXAMPLE,
    description: AppStrings.TASK_DESC_DESCRIPTION,
    required: false,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  task_description?: string

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  category_id: number

  @ApiProperty({
    type: () => Task,
    example: CategoryResponse,
    description: AppStrings.CATEGORY,
  })
  @BelongsTo(() => Category)
  category: Category

  @ForeignKey(() => Periodicity)
  @Column({ type: DataType.INTEGER, allowNull: false })
  periodicity_id: number

  @ApiProperty({
    type: () => Periodicity,
    example: PeriodicityResponse,
    description: AppStrings.PERIODICITY,
  })
  @BelongsTo(() => Periodicity)
  periodicity: Periodicity

  @ApiProperty({
    example: AppStrings.TASK_PERIOD_START_EXAMPLE,
    description: AppStrings.TASK_PERIOD_START_DESCRIPTION,
  })
  @Column({ type: DataType.DATEONLY, allowNull: false })
  period_start: Date

  @ApiProperty({
    example: AppStrings.TASK_PERIOD_END_EXAMPLE,
    description: AppStrings.TASK_PERIOD_END_DESCRIPTION,
  })
  @Column({ type: DataType.DATEONLY, allowNull: false })
  period_end: Date

  @HasMany(() => Order, Task.primaryKeyAttribute)
  orders: NonAttribute<Order[]>
}
