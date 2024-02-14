import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { Facility } from 'src/modules/facility/entities/facility.entity'

@Table
export class FacilityType extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  facility_type_id: number

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  facility_type_name: string

  @HasMany(() => Facility, FacilityType.primaryKeyAttribute)
  orders: NonAttribute<Facility[]>
}
