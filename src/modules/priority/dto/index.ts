import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class CreatePriorityDto {
  @ApiProperty()
  priority_name: string
}

export class UpdatePriorityDto {
  @ApiProperty({ default: 1 })
  priority_id: number

  @ApiProperty({ required: false })
  priority_name?: string
}

export class OrderPrioritySorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  priority_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  priority_name?: string
}

export class OrderPriorityFilters {
  @ApiProperty({ default: 1, required: false })
  priority_id?: number

  @ApiProperty({ required: false })
  priority_name?: string
}
