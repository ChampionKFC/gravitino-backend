import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { FileType } from 'src/modules/file_type/entities/file_type.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Table
export class Report extends Model {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  report_id: number

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  report_user_id: number

  @BelongsTo(() => User)
  report_user: User

  @Column({ type: DataType.STRING, allowNull: false })
  file_sku: string

  @ApiProperty({ example: AppStrings.FILE_ALT_EXAMPLE, description: AppStrings.FILE_ALT_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  file_alt: string

  @ForeignKey(() => FileType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  file_type_id: number

  @ApiProperty({
    type: () => FileType,
    description: AppStrings.FILE_TYPE_NAME_DESCRIPTION,
  })
  @BelongsTo(() => FileType)
  file_type: FileType

  @Column({ type: DataType.JSON, allowNull: false })
  report_json: string
}
