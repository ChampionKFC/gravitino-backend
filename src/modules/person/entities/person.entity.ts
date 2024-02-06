import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from 'sequelize';
import { Model, Table } from 'sequelize-typescript';
import { Column, DataType, HasOne, PrimaryKey } from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Person extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  person_id: number;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  last_name: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  first_name: string;

  @ApiProperty({ example: 'Иванович', description: 'Отчество пользователя' })
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  patronymic: string;

  @ApiProperty({
    example: '+79001234567',
    description: 'Номер телефона пользователя',
  })
  @Column({ type: DataType.STRING(12) })
  phone: string;

  @ApiProperty({ example: [1, 2, 3], description: 'ID характеристик', required: false })
  @Column({ type: DataType.ARRAY(DataType.INTEGER), allowNull: true })
  property_values?: number[];

  @HasOne(() => User, 'person_id')
  user: NonAttribute<User>;
}
