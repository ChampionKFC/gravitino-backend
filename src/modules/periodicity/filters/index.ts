import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { PeriodicityFilters, PeriodicitySorts } from '../dto';

export class PeriodicityFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: PeriodicityFilters;

  @ApiProperty({ required: false })
  sorts?: PeriodicitySorts;
}
