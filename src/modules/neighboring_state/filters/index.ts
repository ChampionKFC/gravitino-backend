import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class NeighboringStateSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  neighboring_state_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  neighboring_state_name?: string
}

export class NeighboringStateFilters {
  @ApiProperty({ default: 1, required: false })
  neighboring_state_id?: number

  @ApiProperty({ required: false })
  neighboring_state_name?: string
}
