import { ApiProperty } from '@nestjs/swagger';
import { UserFilters, UserSorts } from '../dto';
import { FilterOffset } from 'src/common/classes/filter_offset';

export class UserFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: UserFilters;

  @ApiProperty({ required: false })
  sorts?: UserSorts;
}
