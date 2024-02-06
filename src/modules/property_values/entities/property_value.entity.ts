import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, ForeignKey, Model } from 'sequelize-typescript';
import { Column, DataType, PrimaryKey, Table } from 'sequelize-typescript';
import { PropertyName } from 'src/modules/property_names/entities/property_name.entity';

@Table
export class PropertyValue extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  property_value_id: number;

  @ForeignKey(() => PropertyName)
  @Column({ type: DataType.INTEGER, allowNull: false })
  property_name_id: number;

  @ApiProperty({
    type: () => PropertyName,
    description: 'Название характеристики',
  })
  @BelongsTo(() => PropertyName)
  property_name: PropertyName;

  @ApiProperty({ example: '10', description: 'Значение характеристики' })
  @Column({ type: DataType.STRING(30), allowNull: false })
  property_value: string;
}
