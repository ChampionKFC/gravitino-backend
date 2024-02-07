import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Task } from 'src/modules/task/entities/task.entity'

@Table
export class Category extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  category_id: number

  @ApiProperty({ example: AppStrings.CATEGORY_NAME_EXAMPLE, description: AppStrings.CATEGORY_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  category_name: string

  @HasMany(() => Task, Category.primaryKeyAttribute)
  tasks: NonAttribute<Task[]>
}
