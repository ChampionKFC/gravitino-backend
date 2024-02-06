import { ApiProperty } from '@nestjs/swagger'

export class CreateNeighboringStateDto {
  @ApiProperty()
  neighboring_state_name: string
}
export class UpdateNeighboringStateDto {
  @ApiProperty({ default: 1 })
  neighboring_state_id: number

  @ApiProperty({ required: false })
  neighboring_state_name?: string
}
