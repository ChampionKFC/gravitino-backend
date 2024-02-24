import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Order } from 'src/modules/order/entities/order.entity'
import { OrganizationType } from 'src/modules/organization_type/entities/organization_type.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Table
export class Organization extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  organization_id: number

  @ForeignKey(() => OrganizationType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  organization_type_id: number

  @ApiProperty({
    type: () => OrganizationType,
    description: AppStrings.ORGANIZATION_TYPE,
  })
  @BelongsTo(() => OrganizationType)
  organization_type: OrganizationType

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  full_name: string

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  short_name: string

  @ApiProperty({
    example: AppStrings.PHONE_EXAMPLE,
    description: AppStrings.PHONE_DESCRIPTION,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  phone: string

  @ApiProperty({ example: AppStrings.PROPERTY_VALUES_EXAMPLE, description: AppStrings.PROPERTY_VALUES_DESCRIPTION, required: false })
  @Column({ type: DataType.ARRAY(DataType.INTEGER), allowNull: true })
  property_values?: number[]

  @HasMany(() => User, Organization.primaryKeyAttribute)
  users: NonAttribute<User[]>

  @HasMany(() => Order, 'executor_id')
  orders: NonAttribute<Order[]>

  // @HasMany(() => Facility, Organization.primaryKeyAttribute)
  // facilities: NonAttribute<Facility[]>
}
