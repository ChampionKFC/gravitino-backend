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
import { Organization } from 'src/modules/organization/entities/organization.entity';

@Table
export class OrganizationType extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  organization_type_id: number;

  @ApiProperty({
    example: 'Уборка, ремонт',
    description: 'Вид деятельности организации',
  })
  @Column({ type: DataType.STRING(100), allowNull: false })
  organization_type_name: string;

  @HasMany(() => Organization, 'organization_type_id')
  organizations: NonAttribute<Organization[]>;
}
