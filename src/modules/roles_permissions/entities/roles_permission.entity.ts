import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Permission } from 'src/modules/permissions/entities/permission.entity'
import { Role } from 'src/modules/roles/entities/role.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Table
export class RolePermission extends Model {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  role_permission_id: number

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: true })
  role_id?: number

  @ApiProperty({
    type: () => Role,
    required: false,
    description: AppStrings.ROLE_DESCRIPTION,
  })
  @BelongsTo(() => Role)
  role: Role

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  user_id?: number

  @ApiProperty({ required: false })
  @BelongsTo(() => User)
  user: User

  @ForeignKey(() => Permission)
  @Column({ type: DataType.INTEGER, allowNull: false })
  permission_id: number

  @ApiProperty({
    type: () => Permission,
    description: AppStrings.PERMISSION,
  })
  @BelongsTo(() => Permission)
  permission: Permission

  @ApiProperty({
    example: true,
    description: AppStrings.PERMISSION_STATUS,
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  rights: boolean
}
