import { ApiProperty } from '@nestjs/swagger';
import { FilterOffset } from 'src/common/classes/filter_offset';
import { CheckpointTypeFilters, CheckpointTypeSorts } from '../dto';

export class CheckpointTypeFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset;

  @ApiProperty({ required: false })
  filter?: CheckpointTypeFilters;

  @ApiProperty({ required: false })
  sorts?: CheckpointTypeSorts;
}
