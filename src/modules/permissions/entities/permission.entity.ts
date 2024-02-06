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
import { RolePermission } from 'src/modules/roles_permissions/entities/roles_permission.entity';

@Table
export class Permission extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, autoIncrement: true, allowNull: false })
  permission_id: number;

  @ApiProperty({ example: 'category-create', description: 'SKU разрешения' })
  @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
  permission_sku: string;

  @ApiProperty({
    example: 'Создание категорий',
    description: 'Название разрешения',
  })
  @Column({ type: DataType.STRING(30), allowNull: false })
  permission_name: string;

  @ApiProperty({ example: 'Описание', description: 'Описание разрешения' })
  @Column({ type: DataType.STRING, allowNull: false })
  permission_description: string;

  @ApiProperty({ example: 'Organizations', description: 'Название таблицы' })
  @Column({ type: DataType.STRING(30), allowNull: false })
  entity_name: string;

  @HasMany(() => RolePermission, 'permission_id')
  rolesPermissions: NonAttribute<RolePermission[]>;
}
