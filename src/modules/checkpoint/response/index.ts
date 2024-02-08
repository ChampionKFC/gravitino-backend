import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class CheckpointResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  checkpoint_id: number

  @IsString()
  @ApiProperty()
  checkpoint_name: string

  @IsString()
  @ApiProperty()
  address: string

  @IsInt()
  @ApiProperty({ default: 1 })
  branch_id: number

  @IsString()
  @ApiProperty({ required: false })
  neighboring_state_id?: number

  @IsString()
  @ApiProperty()
  district: string

  @IsString()
  @ApiProperty()
  region: string

  @IsInt()
  @ApiProperty()
  checkpoint_type_id: number

  @IsString()
  @ApiProperty({ required: false })
  operating_mode_id: number

  @IsString()
  @ApiProperty({ required: false })
  working_hours_id: number

  @ApiProperty({ required: false })
  property_values?: number[]
}

export class ArrayCheckpointResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: CheckpointResponse, isArray: true })
  data: CheckpointResponse[]
}

export class StatusCheckpointResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: CheckpointResponse
}
