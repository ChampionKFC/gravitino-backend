import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { HasMany, Model, Table } from 'sequelize-typescript'
import { PrimaryKey, Column, DataType } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Checkpoint } from 'src/modules/checkpoint/entities/checkpoint.entity'

@Table
export class Branch extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  branch_id: number

  @ApiProperty({ example: AppStrings.BRANCH_NAME_EXAMPLE, description: AppStrings.BRANCH_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  branch_name: string

  @ApiProperty({
    example: AppStrings.BRANCH_ADDRESS_EXAMPLE,
    description: AppStrings.BRANCH_ADDRESS_DESCRIPTION,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  branch_address: string

  @HasMany(() => Checkpoint, Branch.primaryKeyAttribute)
  checkpoints: NonAttribute<Checkpoint[]>

  // @HasMany(() => Group, 'branch_id')
  // groups: NonAttribute<Group[]>;
}
