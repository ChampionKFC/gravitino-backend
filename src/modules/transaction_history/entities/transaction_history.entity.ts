import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Table, Model } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { User } from 'src/modules/users/entities/user.entity'

@Table
export class TransactionHistory extends Model<TransactionHistory> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  history_id

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number

  @ApiProperty({
    type: () => User,
    description: AppStrings.USER,
  })
  @BelongsTo(() => User)
  user: User

  @Column({ type: DataType.STRING, allowNull: false })
  comment: string
}
