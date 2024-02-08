import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class CreatePeriodicityDto {
  @ApiProperty()
  periodicity_name: string
}

export class UpdatePeriodicityDto {
  @ApiProperty()
  periodicity_id: number

  @ApiProperty({ required: false })
  periodicity_name?: string
}

export class PeriodicitySorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  periodicity_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  periodicity_name?: string
}

export class PeriodicityFilters {
  @ApiProperty({ required: false })
  periodicity_id?: number

  @ApiProperty({ required: false })
  periodicity_name?: string
}
