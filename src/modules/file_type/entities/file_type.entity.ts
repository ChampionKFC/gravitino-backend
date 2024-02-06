import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from 'sequelize';
import { HasMany, Model } from 'sequelize-typescript';
import { Column, DataType, PrimaryKey, Table } from 'sequelize-typescript';
import { File } from 'src/modules/files/entities/file.entity';

@Table
export class FileType extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  file_type_id: number;

  @ApiProperty({ example: 'Фотография', description: 'Тип файла' })
  @Column({ type: DataType.STRING(30), allowNull: false })
  file_type_name: string;

  @ApiProperty({ example: '.xls', description: 'Расширение файла' })
  @Column({ type: DataType.STRING(30), allowNull: false })
  file_extension: string;

  // @HasMany(() => Report, 'file_type_id')
  // reports: NonAttribute<Report[]>;

  @HasMany(() => File, 'file_type_id')
  files: NonAttribute<File[]>;
}
