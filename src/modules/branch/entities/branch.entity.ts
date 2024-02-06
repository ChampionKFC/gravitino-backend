import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from 'sequelize';
import { HasMany, Model, Table } from 'sequelize-typescript';
import {
  PrimaryKey,
  Column,
  DataType,
} from 'sequelize-typescript';
import { Checkpoint } from 'src/modules/checkpoint/entities/checkpoint.entity';

@Table
export class Branch extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  branch_id: number;

  @ApiProperty({ example: 'Филиал №1', description: 'Название филиала' })
  @Column({ type: DataType.STRING, allowNull: false })
  branch_name: string;

  @ApiProperty({
    example: 'улица У.',
    description: 'Местоположение пункта пропуска',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  branch_address: string;

  @HasMany(() => Checkpoint, 'branch_id')
  checkpoints: NonAttribute<Checkpoint[]>;

  // @HasMany(() => Group, 'branch_id')
  // groups: NonAttribute<Group[]>;
}
