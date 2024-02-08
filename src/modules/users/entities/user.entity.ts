import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Auth } from 'src/modules/auth/entities/auth.entity'
import { Group } from 'src/modules/group/entities/group.entity'
import { Order } from 'src/modules/order/entities/order.entity'
import { Organization } from 'src/modules/organization/entities/organization.entity'
import { Person } from 'src/modules/person/entities/person.entity'
import { Role } from 'src/modules/roles/entities/role.entity'
import { RolePermission } from 'src/modules/roles_permissions/entities/roles_permission.entity'
import { TransactionHistory } from 'src/modules/transaction_history/entities/transaction_history.entity'

@Table
export class User extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  user_id: number

  @ForeignKey(() => Person)
  @Column({ type: DataType.INTEGER, allowNull: true })
  person_id?: number

  @ApiProperty({
    type: () => Person,
    required: false,
    description: AppStrings.PERSON,
    nullable: true,
  })
  @BelongsTo(() => Person)
  person?: Person

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id: number

  @ApiProperty({
    type: () => Role,
    description: AppStrings.ROLE_DESCRIPTION,
  })
  @BelongsTo(() => Role)
  role: Role

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER, allowNull: true })
  group_id?: number

  @ApiProperty({
    type: () => Group,
    required: false,
    description: AppStrings.GROUP,
  })
  @BelongsTo(() => Group)
  group: Group

  @ForeignKey(() => Organization)
  @Column({ type: DataType.INTEGER, allowNull: true })
  organization_id?: number

  @ApiProperty({
    type: () => Organization,
    required: false,
    description: AppStrings.ORGANIZATION,
  })
  @BelongsTo(() => Organization)
  organization: Organization

  @ApiProperty({ example: AppStrings.USER_ISACTIVE_EXAMPLE, description: AppStrings.USER_ISACTIVE_DESCRIPTION })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  is_active: boolean

  @ApiProperty({ example: AppStrings.USER_EMAIL_EXAMPLE, description: AppStrings.USER_EMAIL_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string

  @Column({ type: DataType.STRING, allowNull: false })
  password: string

  @HasMany(() => Auth, User.primaryKeyAttribute)
  users: NonAttribute<Auth[]>

  // @HasMany(() => Report, 'report_user_id')
  // reports: Report[];

  @HasMany(() => Order, 'creator_id')
  order_creators: NonAttribute<Order[]>

  @HasMany(() => Order, 'completed_by')
  order_completed_by: NonAttribute<Order[]>

  @HasMany(() => TransactionHistory, { foreignKey: User.primaryKeyAttribute, onUpdate: AppStrings.CASCADE, onDelete: AppStrings.CASCADE })
  history: NonAttribute<TransactionHistory[]>

  @HasMany(() => RolePermission, User.primaryKeyAttribute)
  rolesPermissions: NonAttribute<RolePermission[]>
}
