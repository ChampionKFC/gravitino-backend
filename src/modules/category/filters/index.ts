import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { CategoryFilters, CategorySorts } from '../dto';

export class CategoryFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: CategoryFilters;

  @ApiProperty({ required: false })
  sorts?: CategorySorts;
}
