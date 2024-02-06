import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { Branch } from 'src/modules/branch/entities/branch.entity'
import { CheckpointType } from 'src/modules/checkpoint_type/entities/checkpoint_type.entity'
import { NeighboringState } from 'src/modules/neighboring_state/entities/neighboring_state.entity'
import { OperatingMode } from 'src/modules/operating_mode/entities/operating_mode.entity'
import { WorkingHours } from 'src/modules/working_hours/entities/working_hour.entity'

@Table
export class Checkpoint extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  checkpoint_id: number

  @ApiProperty({
    example: 'Пункт пропуска №1',
    description: 'Название пункта пропуска',
  })
  @Column({ type: DataType.STRING(50), allowNull: false })
  checkpoint_name: string

  @ApiProperty({
    example: 'улица У.',
    description: 'Местоположение пункта пропуска',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  address: string

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER, allowNull: false })
  branch_id: number

  @ApiProperty({
    type: () => Branch,
    description: 'Филиал',
  })
  @BelongsTo(() => Branch)
  branch: Branch

  @ForeignKey(() => NeighboringState)
  @Column({ type: DataType.INTEGER, allowNull: true })
  neighboring_state_id?: number

  @ApiProperty({
    type: () => NeighboringState,
    description: 'Приграничное гос-во',
  })
  @BelongsTo(() => NeighboringState)
  neighboring_state: NeighboringState

  @ApiProperty({ example: 'Округ', description: 'Округ пункта пропуска' })
  @Column({ type: DataType.STRING, allowNull: false })
  district: string

  @ApiProperty({ example: 'Москва', description: 'Область пункта пропуска' })
  @Column({ type: DataType.STRING, allowNull: false })
  region: string

  @ForeignKey(() => CheckpointType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  checkpoint_type_id: number

  @ApiProperty({
    type: () => CheckpointType,
    description: 'Филиал',
  })
  @BelongsTo(() => CheckpointType)
  checkpoint_type: CheckpointType

  @ForeignKey(() => WorkingHours)
  @Column({ type: DataType.INTEGER, allowNull: false })
  working_hours_id: number

  @ApiProperty({
    type: () => WorkingHours,
    description: 'Часы работы',
  })
  @BelongsTo(() => WorkingHours)
  working_hours: WorkingHours

  @ForeignKey(() => OperatingMode)
  @Column({ type: DataType.INTEGER, allowNull: false })
  operating_mode_id: number

  @ApiProperty({
    type: () => OperatingMode,
    description: 'Режим работы',
  })
  @BelongsTo(() => OperatingMode)
  operating_mode: OperatingMode

  @ApiProperty({ example: '1,2,3', description: 'ID характеристик', required: false })
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  property_values?: number[]
}
