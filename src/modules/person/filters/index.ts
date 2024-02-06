import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { PersonFilters, PersonSorts } from '../dto';

export class PersonFilter {
  @ApiProperty()
  offset?: FilterOffset;

  @ApiProperty()
  filter?: PersonFilters;

  @ApiProperty()
  sorts?: PersonSorts;
}
