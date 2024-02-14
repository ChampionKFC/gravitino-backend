import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Checkpoint } from 'src/modules/checkpoint/entities/checkpoint.entity'
import { FacilityType } from 'src/modules/facility_type/entities/facility_type.entity'
import { Order } from 'src/modules/order/entities/order.entity'
import { Organization } from 'src/modules/organization/entities/organization.entity'

@Table
export class Facility extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  facility_id: number

  @ApiProperty({ example: AppStrings.FACILITY_NAME_EXAMPLE, description: AppStrings.FACILITY_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false })
  facility_name: string

  @ForeignKey(() => Organization)
  @Column({ type: DataType.INTEGER, allowNull: false })
  organization_id: number

  @ApiProperty({
    type: () => Organization,
    description: AppStrings.ORGANIZATION,
  })
  @BelongsTo(() => Organization)
  organization: Organization

  @ForeignKey(() => Checkpoint)
  @Column({ type: DataType.INTEGER, allowNull: false })
  checkpoint_id: number

  @ApiProperty({
    type: () => Checkpoint,
    description: AppStrings.CHECKPOINT,
  })
  @BelongsTo(() => Checkpoint)
  checkpoint: Checkpoint

  @ForeignKey(() => FacilityType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  facility_type_id: number

  @ApiProperty({
    type: () => FacilityType,
    description: AppStrings.CHECKPOINT,
  })
  @BelongsTo(() => FacilityType)
  facility_type: FacilityType

  // @ApiProperty({ example: 'улица У.', description: 'Местоположение пункта пропуска' })
  // @Column({ type: DataType.STRING, allowNull: false, })
  // location: string;

  @HasMany(() => Order, Facility.primaryKeyAttribute)
  orders: NonAttribute<Order[]>
}
