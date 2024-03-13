import { ApiProperty } from '@nestjs/swagger'
import { Table, PrimaryKey, Column, DataType, Model } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'

@Table
export class Guest extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  guest_id: number

  @ApiProperty({ example: AppStrings.GUEST_NAME_EXAMPLE, description: AppStrings.GUEST_NAME_DESCRIPTION })
  @Column({ type: DataType.STRING(50), allowNull: false })
  guest_name: string

  @ApiProperty({ example: AppStrings.GUEST_EMAIL_EXAMPLE, description: AppStrings.GUEST_EMAIL_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  guest_email: string

  @ApiProperty({ example: AppStrings.GUEST_PHONE_EXAMPLE, description: AppStrings.GUEST_PHONE_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  guest_phone: string
}
