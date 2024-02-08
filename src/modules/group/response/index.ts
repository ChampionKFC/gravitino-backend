import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsInt, IsOptional, IsArray } from 'class-validator'

export class GroupResponse {
  @IsInt()
  @ApiProperty()
  group_id: number

  @IsString()
  @ApiProperty()
  group_name: string

  @IsInt()
  @ApiProperty({ required: false })
  branch_id?: number
}

export class ArrayGroupResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: GroupResponse, isArray: true })
  data: GroupResponse[]
}

export class StatusGroupResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: GroupResponse
}
