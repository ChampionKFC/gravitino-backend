import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { TaskFilters, TaskSorts } from '../dto';

export class TaskFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: TaskFilters;

  @ApiProperty({ required: false })
  sorts?: TaskSorts;
}
