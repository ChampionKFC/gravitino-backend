import { ApiProperty } from '@nestjs/swagger'

export class NeighboringStateSorts {
  @ApiProperty({ default: 'ASC', required: false })
  neighboring_state_id?: string

  @ApiProperty({ default: 'ASC', required: false })
  neighboring_state_name?: string
}

export class NeighboringStateFilters {
  @ApiProperty({ default: 1, required: false })
  neighboring_state_id?: number

  @ApiProperty({ required: false })
  neighboring_state_name?: string
}
