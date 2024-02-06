import { ApiProperty } from '@nestjs/swagger';
import { BranchFilters, BranchSorts } from '../dto';
import { FilterOffset } from 'src/common/classes/filter_offset';

export class BranchFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: BranchFilters;

  @ApiProperty({ required: false })
  sorts?: BranchSorts;
}
