import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDecimal, IsInt } from 'class-validator'
import { Branch } from 'src/modules/branch/entities/branch.entity'

export class BranchReportResponse {
  @ApiProperty()
  branch: Branch

  @IsInt()
  @ApiProperty()
  completed_count: number

  @IsDecimal()
  @ApiProperty()
  completed_percent: number

  @IsInt()
  @ApiProperty()
  checked_count: number

  @IsDecimal()
  @ApiProperty()
  checked_percent: number
}

export class ArrayBranchReportResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: BranchReportResponse, isArray: true })
  data: BranchReportResponse[]
}
