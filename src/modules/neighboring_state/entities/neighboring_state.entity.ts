import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Checkpoint } from 'src/modules/checkpoint/entities/checkpoint.entity'

@Table
export class NeighboringState extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  neighboring_state_id: number

  @ApiProperty({ example: AppStrings.NEIGHBORING_STATE_NAME_EXAMPLE, description: AppStrings.NEIGHBORING_STATE_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  neighboring_state_name: string

  @HasMany(() => Checkpoint, NeighboringState.primaryKeyAttribute)
  checkpoints: NonAttribute<Checkpoint[]>
}
