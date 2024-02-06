import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { RoleFilters, RoleSorts } from '../dto';

export class RoleFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: RoleFilters;

  @ApiProperty({ required: false })
  sorts?: RoleSorts;
}
