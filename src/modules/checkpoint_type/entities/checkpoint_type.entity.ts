import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Checkpoint } from 'src/modules/checkpoint/entities/checkpoint.entity'

@Table
export class CheckpointType extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  checkpoint_type_id: number

  @ApiProperty({ example: AppStrings.CHECKPOINT_TYPE_NAME_EXAMPLE, description: AppStrings.CHECKPOINT_TYPE_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  checkpoint_type_name: string

  @HasMany(() => Checkpoint, CheckpointType.primaryKeyAttribute)
  checkpoints: NonAttribute<Checkpoint[]>
}
