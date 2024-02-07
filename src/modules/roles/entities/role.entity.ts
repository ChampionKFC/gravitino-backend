import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { RolePermission } from 'src/modules/roles_permissions/entities/roles_permission.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Table
export class Role extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  role_id: number

  @ApiProperty({ example: AppStrings.ROLE_NAME_EXAMPLE, description: AppStrings.ROLE_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false })
  role_name: string

  @HasMany(() => User, Role.primaryKeyAttribute)
  users: NonAttribute<User[]>

  @HasMany(() => RolePermission, Role.primaryKeyAttribute)
  rolesPermissions: NonAttribute<RolePermission[]>
}
