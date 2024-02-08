import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class CheckpointTypeResponse {
  @IsInt()
  @ApiProperty()
  checkpoint_type_id: number

  @IsString()
  @ApiProperty()
  checkpoint_type_name: string
}

export class ArrayCheckpointTypeResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: CheckpointTypeResponse, isArray: true })
  data: CheckpointTypeResponse[]
}

export class StatusCheckpointTypeResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: CheckpointTypeResponse
}
