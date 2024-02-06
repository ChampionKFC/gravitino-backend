import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export class NeighboringState extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  neighboring_state_id: number

  @ApiProperty({ example: 'Китай', description: 'Приграничное гос-во' })
  @Column({ type: DataType.STRING, allowNull: false })
  neighboring_state_name: string
}
