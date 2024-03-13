import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { NonAttribute } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Facility } from 'src/modules/facility/entities/facility.entity'
import { File } from 'src/modules/files/entities/file.entity'
import { Guest } from 'src/modules/guest/entities/guest.entity'
import { OrderJournal } from 'src/modules/order_journal/entities/order_journal.entity'
import { OrderStatus } from 'src/modules/order_status/entities/order_status.entity'
import { Organization } from 'src/modules/organization/entities/organization.entity'
import { OrderPriority } from 'src/modules/priority/entities/priority.entity'
import { Task } from 'src/modules/task/entities/task.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Table
export class Order extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  order_id: number

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: true })
  task_id?: number

  @IsOptional()
  @ApiProperty({
    type: () => Task,
    required: false,
    description: AppStrings.TASK,
  })
  @BelongsTo(() => Task)
  task?: Task

  @ApiProperty({ required: false })
  @Column({ type: DataType.STRING, allowNull: true })
  order_name?: string

  @ApiProperty({ required: false })
  @Column({ type: DataType.TEXT, allowNull: true })
  order_description?: string

  @ForeignKey(() => Facility)
  @Column({ type: DataType.INTEGER, allowNull: false })
  facility_id: number

  @ApiProperty({
    type: () => Facility,
    description: AppStrings.FACILITY,
  })
  @BelongsTo(() => Facility)
  facility: Facility

  @ForeignKey(() => Organization)
  @Column({ type: DataType.INTEGER, allowNull: true })
  executor_id?: number

  @ApiProperty({
    type: () => Organization,
    description: AppStrings.ORGANIZATION,
  })
  @BelongsTo(() => Organization)
  executor: Organization

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  completed_by?: number

  @ApiProperty({
    type: () => User,
    required: false,
    description: AppStrings.ORDER_EXECUTOR,
  })
  @BelongsTo(() => User)
  completed_by_user?: User

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  creator_id?: number

  @ApiProperty({
    type: () => User,
    description: AppStrings.ORDER_CREATOR,
  })
  @BelongsTo(() => User, 'creator_id')
  creator: User

  @ForeignKey(() => Guest)
  @Column({ type: DataType.INTEGER, allowNull: true })
  guest_id?: number

  @ApiProperty({
    type: () => Guest,
    description: AppStrings.ORDER_GUEST,
  })
  @BelongsTo(() => Guest, 'guest_id')
  guest: Guest

  @ForeignKey(() => OrderStatus)
  @Column({ type: DataType.INTEGER, allowNull: true })
  order_status_id: number

  @ApiProperty({
    type: () => OrderStatus,
    description: AppStrings.ORDER_STATUS,
  })
  @BelongsTo(() => OrderStatus)
  order_status: OrderStatus

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: true })
  planned_datetime?: Date

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: true })
  task_end_datetime?: Date

  @ApiProperty({ required: false })
  @Column({ type: DataType.DATE, allowNull: true })
  ended_at_datetime?: Date

  @ApiProperty({ required: false })
  @Column({ type: DataType.DATE, allowNull: true })
  closed_at_datetime?: Date

  @ForeignKey(() => OrderPriority)
  @Column({ type: DataType.INTEGER, allowNull: false })
  priority_id: number

  @ApiProperty({
    type: () => OrderPriority,
    description: AppStrings.ORDER_PRIORITY,
  })
  @BelongsTo(() => OrderPriority)
  priority: OrderPriority

  @ApiProperty({ example: AppStrings.PROPERTY_VALUES_EXAMPLE, description: AppStrings.PROPERTY_VALUES_DESCRIPTION, required: false })
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  property_values?: number[]

  @HasMany(() => File, { foreignKey: Order.primaryKeyAttribute, onDelete: AppStrings.CASCADE, onUpdate: AppStrings.CASCADE })
  files: NonAttribute<File[]>

  @HasMany(() => OrderJournal, { foreignKey: Order.primaryKeyAttribute, onDelete: AppStrings.CASCADE, onUpdate: AppStrings.CASCADE })
  order_journals: NonAttribute<OrderJournal[]>
}
