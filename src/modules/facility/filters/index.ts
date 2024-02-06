import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { FacilityFilters, FacilitySorts } from '../dto';

export class FacilityFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: FacilityFilters;

  @ApiProperty({ required: false })
  sorts?: FacilitySorts;
}
