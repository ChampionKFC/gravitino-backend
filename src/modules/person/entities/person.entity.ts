import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Model, Table } from 'sequelize-typescript'
import { Column, DataType, HasOne, PrimaryKey } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { User } from 'src/modules/users/entities/user.entity'

@Table
export class Person extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  person_id: number

  @ApiProperty({ example: AppStrings.PERSON_LAST_NAME_EXAMPLE, description: AppStrings.PERSON_LAST_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false })
  last_name: string

  @ApiProperty({ example: AppStrings.PERSON_FIRST_NAME_EXAMPLE, description: AppStrings.PERSON_FIRST_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false })
  first_name: string

  @ApiProperty({ example: AppStrings.PERSON_PATRONYMIC_NAME_EXAMPLE, description: AppStrings.PERSON_PATRONYMIC_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), defaultValue: '' })
  patronymic: string

  @ApiProperty({
    example: AppStrings.PHONE_EXAMPLE,
    description: AppStrings.PHONE_DESCRIPTION,
  })
  @Column({ type: DataType.STRING(12) })
  phone: string

  @ApiProperty({ example: AppStrings.PROPERTY_VALUES_EXAMPLE, description: AppStrings.PROPERTY_VALUES_DESCRIPTION, required: false })
  @Column({ type: DataType.ARRAY(DataType.INTEGER), allowNull: true })
  property_values?: number[]

  @HasOne(() => User, Person.primaryKeyAttribute)
  user: NonAttribute<User>
}
