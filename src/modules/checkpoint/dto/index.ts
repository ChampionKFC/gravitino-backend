import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'
import { BranchFilters, BranchSorts } from 'src/modules/branch/dto'
import { CheckpointTypeFilters, CheckpointTypeSorts } from 'src/modules/checkpoint_type/dto'
import { NeighboringStateFilters, NeighboringStateSorts } from 'src/modules/neighboring_state/filters'
import { OperatingModeFilters, OperatingModeSorts } from 'src/modules/operating_mode/filters'
import { WorkingHoursFilters, WorkingHoursSorts } from 'src/modules/working_hours/filters'

export class CreateCheckpointDto {
  @ApiProperty()
  checkpoint_name: string

  @ApiProperty()
  address: string

  @ApiProperty({ default: 1 })
  branch_id: number

  @ApiProperty({ required: false })
  neighboring_state_id?: number

  @ApiProperty()
  district: string

  @ApiProperty()
  region: string

  @ApiProperty({ default: 1 })
  checkpoint_type_id: number

  @ApiProperty({ default: 1 })
  operating_mode: number

  @ApiProperty({ default: 1 })
  working_hours_id: number

  @ApiProperty({ default: [], required: false })
  property_values?: number[]
}

export class UpdateCheckpointDto {
  @ApiProperty({ default: 1 })
  checkpoint_id: number

  @ApiProperty({ required: false })
  checkpoint_name?: string

  @ApiProperty({ required: false })
  address?: string

  @ApiProperty({ default: 1, required: false })
  branch_id?: number

  @ApiProperty({ required: false })
  neighboring_state_id?: number

  @ApiProperty({ required: false })
  district?: string

  @ApiProperty({ required: false })
  region?: string

  @ApiProperty({ default: 1, required: false })
  checkpoint_type_id?: number

  @ApiProperty({ required: false, default: 1 })
  operating_mode_id?: number

  @ApiProperty({ required: false, default: 1 })
  working_hours_id?: number

  @ApiProperty({ default: [], required: false })
  property_values?: number[]
}

export class CheckpointSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  checkpoint_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  checkpoint_name?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  address?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  lat?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  lng?: string

  @ApiProperty({ required: false })
  neighboring_state?: NeighboringStateSorts

  @ApiProperty({ default: AppStrings.ASC, required: false })
  district?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  region?: string

  @ApiProperty({ required: false })
  checkpoint_type?: CheckpointTypeSorts

  @ApiProperty({ required: false })
  operating_mode?: OperatingModeSorts

  @ApiProperty({ required: false })
  working_hours?: WorkingHoursSorts

  @ApiProperty({ required: false })
  branch?: BranchSorts
}

export class CheckpointFilters {
  @ApiProperty({ default: 1, required: false })
  checkpoint_id?: number

  @ApiProperty({ required: false })
  checkpoint_name?: string

  @ApiProperty({ required: false })
  address?: string

  @ApiProperty({ required: false })
  lat?: number

  @ApiProperty({ required: false })
  lng?: number

  @ApiProperty({ required: false })
  neighboring_state?: NeighboringStateFilters

  @ApiProperty({ required: false })
  district?: string

  @ApiProperty({ required: false })
  region?: string

  @ApiProperty({ required: false })
  checkpoint_type?: CheckpointTypeFilters

  @ApiProperty({ required: false })
  operating_mode?: OperatingModeFilters

  @ApiProperty({ required: false })
  working_hours?: WorkingHoursFilters

  @ApiProperty({ required: false })
  branch?: BranchFilters
}
