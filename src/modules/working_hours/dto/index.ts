import { ApiProperty } from '@nestjs/swagger'

export class CreateWorkingHourDto {
  @ApiProperty()
  working_hours_name: string
}
export class UpdateWorkingHourDto {
  @ApiProperty({ default: 1 })
  working_hours_id

  @ApiProperty({ required: false })
  working_hours_name?: string
}
