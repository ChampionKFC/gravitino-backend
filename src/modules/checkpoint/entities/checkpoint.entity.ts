import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
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
    example: AppStrings.CHECKPOINT_NAME_EXAMPLE,
    description: AppStrings.CHECKPOINT_NAME_DESCRIPTION,
  })
  @Column({ type: DataType.STRING(50), allowNull: false })
  checkpoint_name: string

  @ApiProperty({
    example: AppStrings.CHECKPOINT_ADDRESS_EXAMPLE,
    description: AppStrings.CHECKPOINT_ADDRESS_DESCRIPTION,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  address: string

  @ApiProperty()
  @Column({ type: DataType.DOUBLE, allowNull: false })
  lat: number

  @ApiProperty()
  @Column({ type: DataType.DOUBLE, allowNull: false })
  lng: number

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER, allowNull: false })
  branch_id: number

  @ApiProperty({
    type: () => Branch,
    description: AppStrings.BRANCH,
  })
  @BelongsTo(() => Branch)
  branch: Branch

  @ForeignKey(() => NeighboringState)
  @Column({ type: DataType.INTEGER, allowNull: true })
  neighboring_state_id?: number

  @ApiProperty({
    type: () => NeighboringState,
    description: AppStrings.NEIGHBORING_STATE,
  })
  @BelongsTo(() => NeighboringState)
  neighboring_state: NeighboringState

  @ApiProperty({ example: AppStrings.CHECKPOINT_DISTRICT_EXAMPLE, description: AppStrings.CHECKPOINT_DISTRICT_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  district: string

  @ApiProperty({ example: AppStrings.CHECKPOINT_REGION_EXAMPLE, description: AppStrings.CHECKPOINT_REGION_DESCRIPTION })
  @Column({ type: DataType.STRING, allowNull: false })
  region: string

  @ForeignKey(() => CheckpointType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  checkpoint_type_id: number

  @ApiProperty({
    type: () => CheckpointType,
    description: AppStrings.BRANCH,
  })
  @BelongsTo(() => CheckpointType)
  checkpoint_type: CheckpointType

  @ForeignKey(() => WorkingHours)
  @Column({ type: DataType.INTEGER, allowNull: false })
  working_hours_id: number

  @ApiProperty({
    type: () => WorkingHours,
    description: AppStrings.WORKING_HOURS,
  })
  @BelongsTo(() => WorkingHours)
  working_hours: WorkingHours

  @ForeignKey(() => OperatingMode)
  @Column({ type: DataType.INTEGER, allowNull: false })
  operating_mode_id: number

  @ApiProperty({
    type: () => OperatingMode,
    description: AppStrings.OPERATING_MODE,
  })
  @BelongsTo(() => OperatingMode)
  operating_mode: OperatingMode

  @ApiProperty({ example: AppStrings.PROPERTY_VALUES_EXAMPLE, description: AppStrings.PROPERTY_VALUES_DESCRIPTION, required: false })
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  property_values?: number[]
}
