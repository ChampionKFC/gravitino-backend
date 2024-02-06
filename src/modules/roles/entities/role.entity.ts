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
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Role extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  role_id: number;

  @ApiProperty({ example: 'Заказчик', description: 'Роль пользователя' })
  @Column({ type: DataType.STRING(30), allowNull: false })
  role_name: string;

  @HasMany(() => User, 'role_id')
  users: NonAttribute<User[]>;

  @HasMany(() => RolePermission, 'role_id')
  rolesPermissions: NonAttribute<RolePermission[]>;
}
