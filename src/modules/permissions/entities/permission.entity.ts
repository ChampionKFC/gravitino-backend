import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { RolePermission } from 'src/modules/roles_permissions/entities/roles_permission.entity'

@Table
export class Permission extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, autoIncrement: true, allowNull: false })
  permission_id: number

  @ApiProperty({ example: AppStrings.PERMISSIONS_SKU_EXAMPLE, description: AppStrings.PERMISSIONS_SKU_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  permission_sku: string

  @ApiProperty({
    example: AppStrings.PERMISSIONS_NAME_EXAMPLE,
    description: AppStrings.PERMISSIONS_NAME_DESCRIPTION,
  })
  @Column({ type: DataType.STRING(50), allowNull: false })
  permission_name: string

  @ApiProperty({ example: AppStrings.PERMISSIONS_DESC_EXAMPLE, description: AppStrings.PERMISSIONS_DESC_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  permission_description: string

  @ApiProperty({ example: AppStrings.PERMISSIONS_ENTITY_NAME_EXAMPLE, description: AppStrings.PERMISSIONS_ENTITY_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false })
  entity_name: string

  @HasMany(() => RolePermission, Permission.primaryKeyAttribute)
  rolesPermissions: NonAttribute<RolePermission[]>
}
