import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { OrganizationFilters, OrganizationSorts } from '../dto';

export class OrganizationFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: OrganizationFilters;

  @ApiProperty({ required: false })
  sorts?: OrganizationSorts;
}
