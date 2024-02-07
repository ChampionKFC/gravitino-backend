import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { HasMany, Model } from 'sequelize-typescript'
import { Table, PrimaryKey, Column, DataType } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { PropertyValue } from 'src/modules/property_values/entities/property_value.entity'

@Table
export class PropertyName extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  property_name_id: number

  @ApiProperty({
    example: AppStrings.PROPERTY_NAME_EXAMPLE,
    description: AppStrings.PROPERTY_NAME_DESCRIPTION,
  })
  @Column({ type: DataType.STRING(30), allowNull: false })
  property_name: string

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  entity_name: string

  @HasMany(() => PropertyValue, PropertyName.primaryKeyAttribute)
  orders: NonAttribute<PropertyValue[]>
}
