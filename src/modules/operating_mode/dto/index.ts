import { ApiProperty } from '@nestjs/swagger'

export class CreateOperatingModeDto {
  @ApiProperty()
  operating_mode_name: string
}
export class UpdateOperatingModeDto {
  @ApiProperty({ default: 1 })
  operating_mode_id: number

  @ApiProperty({ required: false })
  operating_mode_name?: string
}
