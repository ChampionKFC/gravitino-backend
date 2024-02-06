import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class NeighboringStateResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  neighboring_state_id: number

  @IsString()
  @ApiProperty()
  neighboring_state_name: string
}

export class StatusNeighboringStateResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: NeighboringStateResponse
}
