import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from 'sequelize';
import { HasMany, Model } from 'sequelize-typescript';
import { Table, PrimaryKey, Column, DataType } from 'sequelize-typescript';
import { PropertyValue } from 'src/modules/property_values/entities/property_value.entity';

@Table
export class PropertyName extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  property_name_id: number;

  @ApiProperty({
    example: 'Характеристика',
    description: 'Название характеристики',
  })
  @Column({ type: DataType.STRING(30), allowNull: false })
  property_name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  entity_name: string;

  @HasMany(() => PropertyValue, 'property_name_id')
  orders: NonAttribute<PropertyValue[]>;
}
