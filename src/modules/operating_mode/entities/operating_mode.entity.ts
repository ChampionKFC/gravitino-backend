import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export class OperatingMode extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  operating_mode_id: number

  @ApiProperty({ example: 'Постоянный', description: 'Режим работы' })
  @Column({ type: DataType.STRING, allowNull: false })
  operating_mode_name: string
}
