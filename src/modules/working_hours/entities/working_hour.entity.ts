import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'

@Table
export class WorkingHours extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  working_hours_id: number

  @ApiProperty({ example: AppStrings.WORKING_HOURS_NAME_EXAMPLE, description: AppStrings.WORKING_HOURS_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  working_hours_name: string
}
