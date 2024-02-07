import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { HasMany, Model } from 'sequelize-typescript'
import { Column, DataType, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { File } from 'src/modules/files/entities/file.entity'

@Table
export class FileType extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  file_type_id: number

  @ApiProperty({ example: AppStrings.FILE_TYPE_NAME_EXAMPLE, description: AppStrings.FILE_TYPE_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(30), allowNull: false })
  file_type_name: string

  @ApiProperty({ example: AppStrings.FILE_TYPE_EXTENSION_EXAMPLE, description: AppStrings.FILE_TYPE_EXTENSION_DESCRIPTION })
  @Column({ type: DataType.STRING(30), allowNull: false })
  file_extension: string

  // @HasMany(() => Report, 'file_type_id')
  // reports: NonAttribute<Report[]>;

  @HasMany(() => File, FileType.primaryKeyAttribute)
  files: NonAttribute<File[]>
}
