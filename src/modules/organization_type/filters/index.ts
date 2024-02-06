import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { OrganizationTypeFilters, OrganizationTypeSorts } from '../dto';

export class OrganizationTypeFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: OrganizationTypeFilters;

  @ApiProperty({ required: false })
  sorts?: OrganizationTypeSorts;
}
