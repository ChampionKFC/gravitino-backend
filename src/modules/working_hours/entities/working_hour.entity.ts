import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class WorkingHours extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  working_hours_id: number;

  @ApiProperty({ example: 'Круглосуточно', description: 'Часы работы' })
  @Column({ type: DataType.STRING, allowNull: false })
  working_hours_name: string;
}
