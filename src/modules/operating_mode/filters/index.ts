import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class OperatingModeSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  operating_mode_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  operating_mode_name?: string
}

export class OperatingModeFilters {
  @ApiProperty({ default: 1, required: false })
  operating_mode_id?: number

  @ApiProperty({ required: false })
  operating_mode_name?: string
}
