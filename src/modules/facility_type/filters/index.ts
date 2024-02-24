import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class FacilityTypeSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  facility_type_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  facility_type_name?: string
}

export class FacilityTypeFilters {
  @ApiProperty({ default: 1, required: false })
  facility_type_id?: number

  @ApiProperty({ required: false })
  facility_type_name?: string
}
