import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export class FacilityType extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  facility_type_id: number

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  facility_type_name: string
}
