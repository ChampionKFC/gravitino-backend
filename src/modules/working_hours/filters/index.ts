import { ApiProperty } from '@nestjs/swagger'

export class WorkingHoursSorts {
  @ApiProperty({ default: 'ASC', required: false })
  working_hours_id?: string

  @ApiProperty({ default: 'ASC', required: false })
  working_hours_name?: string
}

export class WorkingHoursFilters {
  @ApiProperty({ default: 1, required: false })
  working_hours_id?: number

  @ApiProperty({ required: false })
  working_hours_name?: string
}
