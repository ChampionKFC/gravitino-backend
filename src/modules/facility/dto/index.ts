import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'
import { CheckpointFilters, CheckpointSorts } from 'src/modules/checkpoint/dto'
import { FacilityTypeSorts, FacilityTypeFilters } from 'src/modules/facility_type/filters'

export class CreateFacilityDto {
  @ApiProperty()
  facility_name: string

  @ApiProperty({ default: [] })
  organization_ids: number[]

  @ApiProperty({ default: 1 })
  checkpoint_id: number

  @ApiProperty({ default: 1 })
  facility_type_id: number
}

export class UpdateFacilityDto {
  @ApiProperty({ default: 1 })
  facility_id: number

  @ApiProperty({ required: false })
  facility_name?: string

  @ApiProperty({ default: [], required: false })
  organization_ids?: number[]

  @ApiProperty({ default: 1, required: false })
  checkpoint_id?: number

  @ApiProperty({ default: 1 })
  facility_type_id?: number
}

export class FacilitySorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  facility_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  facility_name?: string

  // @ApiProperty({ required: false })
  // organization?: OrganizationSorts

  @ApiProperty({ required: false })
  checkpoint?: CheckpointSorts

  @ApiProperty({ required: false })
  facility_type?: FacilityTypeSorts
}

export class FacilityFilters {
  @ApiProperty({ default: 1, required: false })
  facility_id?: number

  @ApiProperty({ required: false })
  facility_name?: string

  // @ApiProperty({ required: false })
  // organization?: OrganizationFilters

  @ApiProperty({ required: false })
  checkpoint?: CheckpointFilters

  @ApiProperty({ required: false })
  facility_type?: FacilityTypeFilters
}
