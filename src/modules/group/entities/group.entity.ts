import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from 'sequelize';
import { BelongsTo } from 'sequelize-typescript';
import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Branch } from 'src/modules/branch/entities/branch.entity';
import { Checkpoint } from 'src/modules/checkpoint/entities/checkpoint.entity';
import { Facility } from 'src/modules/facility/entities/facility.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Group extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  group_id: number;

  @ApiProperty({ example: 'Группа №1', description: 'Название группы' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  group_name: string;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER, allowNull: true })
  branch_id?: number;

  @ApiProperty({
    type: () => Branch,
    required: false,
    description: 'Филиал',
  })
  @BelongsTo(() => Branch)
  branch: Branch;

  @ForeignKey(() => Checkpoint)
  @Column({ type: DataType.INTEGER, allowNull: true })
  checkpoint_id?: number;

  @ApiProperty({
    type: () => Checkpoint,
    required: false,
    description: 'Пункт пропуска',
  })
  @BelongsTo(() => Branch)
  checkpoint: Checkpoint;

  @ForeignKey(() => Facility)
  @Column({ type: DataType.INTEGER, allowNull: true })
  facility_id?: number;

  @ApiProperty({
    type: () => Facility,
    required: false,
    description: 'Пункт пропуска',
  })
  @BelongsTo(() => Facility)
  facility: Facility;

  @HasMany(() => User, 'group_id')
  users: NonAttribute<User[]>;
}