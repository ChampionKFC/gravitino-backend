import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class RolePermission extends Model {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  role_permission_id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: true })
  role_id?: number;

  @ApiProperty({
    type: () => Role,
    required: false,
    description: 'Роль пользователя (пользователь, администратор и т.д.)',
  })
  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  user_id?: number;

  @ApiProperty({ required: false })
  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Permission)
  @Column({ type: DataType.INTEGER, allowNull: false })
  permission_id: number;

  @ApiProperty({
    type: Permission,
    example: {
      permission_id: 1,
      action_name: 'users-create',
      entity_name: 'Users',
    },
    description: 'Разрешение',
  })
  @BelongsTo(() => Permission)
  permission: Permission;

  @ApiProperty({
    example: true,
    description: 'Статус разрешения',
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  rights: boolean;
}
