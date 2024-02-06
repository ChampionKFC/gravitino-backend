import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Group } from 'src/modules/group/entities/group.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { Person } from 'src/modules/person/entities/person.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RolePermission } from 'src/modules/roles_permissions/entities/roles_permission.entity';
import { TransactionHistory } from 'src/modules/transaction_history/entities/transaction_history.entity';

@Table
export class User extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  user_id: number;

  @ForeignKey(() => Person)
  @Column({ type: DataType.INTEGER, allowNull: true })
  person_id?: number;

  @ApiProperty({
    type: () => Person,
    required: false,
    description: 'Данные пользователя',
    nullable: true,
  })
  @BelongsTo(() => Person)
  person?: Person;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id: number;

  @ApiProperty({
    type: () => Role,
    description:
      'Роль пользователя (исполнитель, заказчик, администратор и т.д.)',
  })
  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER, allowNull: true })
  group_id?: number;

  @ApiProperty({
    type: () => Group,
    required: false,
    description: 'Группа пользователя',
  })
  @BelongsTo(() => Group)
  group: Group;

  @ForeignKey(() => Organization)
  @Column({ type: DataType.INTEGER, allowNull: true })
  organization_id?: number;

  @ApiProperty({
    type: () => Organization,
    required: false,
    description: 'Организация',
  })
  @BelongsTo(() => Organization)
  organization: Organization;

  @ApiProperty({ example: true, description: 'Активна ли учетная запись' })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_active: boolean;

  @ApiProperty({ example: 'email', description: 'E-Mail пользователя' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasMany(() => Auth, 'user_id')
  users: NonAttribute<Auth[]>;

  // @HasMany(() => Report, 'report_user_id')
  // reports: Report[];

  @HasMany(() => Order, 'creator_id')
  order_creators: NonAttribute<Order[]>;

  @HasMany(() => Order, 'completed_by')
  order_completed_by: NonAttribute<Order[]>;

  @HasMany(() => TransactionHistory, 'user_id')
  history: NonAttribute<TransactionHistory[]>;

  @HasMany(() => RolePermission, 'user_id')
  rolesPermissions: NonAttribute<RolePermission[]>;
}
