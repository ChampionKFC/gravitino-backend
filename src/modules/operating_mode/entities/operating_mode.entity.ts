import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'

@Table
export class OperatingMode extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  operating_mode_id: number

  @ApiProperty({ example: AppStrings.OPERATING_MODE_NAME_EXAMPLE, description: AppStrings.OPERATING_MODE_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  operating_mode_name: string
}
