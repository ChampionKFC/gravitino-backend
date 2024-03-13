import { ApiProperty } from '@nestjs/swagger'
import { FilterOffset } from 'src/common/classes/filter_offset'
import { CheckpointFilters, CheckpointSorts } from '../dto'
import { ReportFilters } from 'src/modules/report/filters'

export class CheckpointFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset

  @ApiProperty({ required: false })
  filter?: CheckpointFilters

  @ApiProperty({ required: false })
  sorts?: CheckpointSorts

  @ApiProperty({ required: false })
  report_filter?: ReportFilters
}
