import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'
import { CheckpointFilters, CheckpointSorts } from 'src/modules/checkpoint/dto'
import { OrganizationFilters, OrganizationSorts } from 'src/modules/organization/dto'

export class CreateFacilityDto {
  @ApiProperty()
  facility_name: string

  @ApiProperty({ default: 1 })
  organization_id: number

  @ApiProperty({ default: 1 })
  checkpoint_id: number
}

export class UpdateFacilityDto {
  @ApiProperty({ default: 1 })
  facility_id: number

  @ApiProperty({ required: false })
  facility_name?: string

  @ApiProperty({ default: 1, required: false })
  organization_id?: number

  @ApiProperty({ default: 1, required: false })
  checkpoint_id?: number
}

export class FacilitySorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  facility_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  facility_name?: string

  @ApiProperty({ required: false })
  organization?: OrganizationSorts

  @ApiProperty({ required: false })
  checkpoint?: CheckpointSorts
}

export class FacilityFilters {
  @ApiProperty({ default: 1, required: false })
  facility_id?: number

  @ApiProperty({ required: false })
  facility_name?: string

  @ApiProperty({ required: false })
  organization?: OrganizationFilters

  @ApiProperty({ required: false })
  checkpoint?: CheckpointFilters
}
