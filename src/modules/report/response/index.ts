import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDecimal, IsInt } from 'class-validator'
import { Branch } from 'src/modules/branch/entities/branch.entity'
import { Checkpoint } from 'src/modules/checkpoint/entities/checkpoint.entity'
import { Organization } from 'src/modules/organization/entities/organization.entity'

export class BranchReportResponse {
  @ApiProperty()
  branch: Branch

  @IsInt()
  @ApiProperty()
  all_count: number

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

export class CheckpointReportResponse {
  @ApiProperty()
  checkpoint?: Checkpoint

  @IsInt()
  @ApiProperty()
  all_count: number

  @IsInt()
  @ApiProperty()
  completed_count: number

  @IsDecimal()
  @ApiProperty()
  completed_percent: string

  @IsInt()
  @ApiProperty()
  checked_count: number

  @IsDecimal()
  @ApiProperty()
  checked_percent: string
}

export class ArrayCheckpointReportResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: CheckpointReportResponse, isArray: true })
  data: CheckpointReportResponse[]
}

export class OrganizationsReportResponse {
  @ApiProperty()
  organization: Organization

  @IsInt()
  @ApiProperty()
  all_count: number

  @IsInt()
  @ApiProperty()
  completed_count: number

  @IsDecimal()
  @ApiProperty()
  completed_percent: string

  @IsInt()
  @ApiProperty()
  checked_count: number

  @IsDecimal()
  @ApiProperty()
  checked_percent: string
}

export class ArrayOrganizationsReportResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: OrganizationsReportResponse, isArray: true })
  data: OrganizationsReportResponse[]
}
