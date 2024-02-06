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
import { Facility } from 'src/modules/facility/entities/facility.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { OrganizationType } from 'src/modules/organization_type/entities/organization_type.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Organization extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  organization_id: number;

  @ForeignKey(() => OrganizationType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  organization_type_id: number;

  @ApiProperty({
    type: () => OrganizationType,
    description: 'Тип организации',
  })
  @BelongsTo(() => OrganizationType)
  organization_type: OrganizationType;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  full_name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  short_name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  register_number: string;

  @ApiProperty({
    example: '79001234567',
    description: 'Номер телефона организации',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @ApiProperty({ example: 'email@mail.com', description: 'Email организации', required: false })
  @Column({ type: DataType.STRING, allowNull: true })
  email?: string;

  @ApiProperty({ example: '[1,2,3]', description: 'ID характеристик', required: false })
  @Column({ type: DataType.ARRAY(DataType.INTEGER), allowNull: true })
  property_values?: number[];

  @HasMany(() => User, 'organization_id')
  users: NonAttribute<User[]>;

  @HasMany(() => Order, 'executor_id')
  orders: NonAttribute<Order[]>;

  @HasMany(() => Facility, 'organization_id')
  facilities: NonAttribute<Facility[]>;
}