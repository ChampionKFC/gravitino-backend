import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { FileType } from 'src/modules/file_type/entities/file_type.entity'
import { Order } from 'src/modules/order/entities/order.entity'

@Table
export class File extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  file_id: number

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  order_id: number

  @ApiProperty({
    type: () => Order,
    description: AppStrings.ORDER,
  })
  @BelongsTo(() => Order)
  order: Order

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  file_sku: string

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  file_alt: string

  @ForeignKey(() => FileType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  file_type_id: number

  @ApiProperty({
    type: () => FileType,
    description: AppStrings.FILE_TYPE,
  })
  @BelongsTo(() => FileType)
  file_type: FileType
}
