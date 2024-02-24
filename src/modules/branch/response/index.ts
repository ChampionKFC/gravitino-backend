import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class BranchResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  branch_id: number

  @IsString()
  @ApiProperty()
  branch_name: string

  @IsString()
  @ApiProperty()
  branch_address: string
}

export class ArrayBranchResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: BranchResponse, isArray: true })
  data: BranchResponse[]
}

export class StatusBranchResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: BranchResponse
}
