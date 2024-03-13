import { ApiProperty } from '@nestjs/swagger'
import { FilterOffset } from 'src/common/classes/filter_offset'
import { AppStrings } from 'src/common/constants/strings'
import { CheckpointFilters, CheckpointSorts } from 'src/modules/checkpoint/dto'
import { ReportDto } from '../dto'
import { BranchFilters, BranchSorts } from 'src/modules/branch/dto'
import { OrganizationFilters, OrganizationSorts } from 'src/modules/organization/dto'

export class ReportFilters {
  @ApiProperty({ required: false })
  min_completed_count?: number

  @ApiProperty({ required: false })
  max_completed_count?: number

  @ApiProperty({ required: false })
  min_completed_percent?: number

  @ApiProperty({ required: false })
  max_completed_percent?: number

  @ApiProperty({ required: false })
  min_checked_count?: number

  @ApiProperty({ required: false })
  max_checked_count?: number

  @ApiProperty({ required: false })
  min_checked_percent?: number

  @ApiProperty({ required: false })
  max_checked_percent?: number
}

export class ReportSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  completed_count?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  completed_percent?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  checked_count?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  checked_percent?: string
}

export class BranchReportFilters {
  @ApiProperty({ required: false })
  report: ReportFilters

  @ApiProperty({ required: false })
  branch: BranchFilters
}

export class BranchReportSorts {
  @ApiProperty({ required: false })
  report: ReportSorts

  @ApiProperty({ required: false })
  branch: BranchSorts
}

export class BranchReportFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset

  @ApiProperty({ required: false })
  filter?: BranchReportFilters

  @ApiProperty({ required: false })
  sorts?: BranchReportSorts

  @ApiProperty({ required: false })
  period?: ReportDto
}

export class CheckpointReportFilters {
  @ApiProperty({ required: false })
  report: ReportFilters

  @ApiProperty({ required: false })
  checkpoint: CheckpointFilters
}

export class CheckpointReportSorts {
  @ApiProperty({ required: false })
  report: ReportSorts

  @ApiProperty({ required: false })
  checkpoint: CheckpointSorts
}

export class CheckpointReportFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset

  @ApiProperty({ required: false })
  filter?: CheckpointReportFilters

  @ApiProperty({ required: false })
  sorts?: CheckpointReportSorts

  @ApiProperty({ required: false })
  period?: ReportDto
}

export class OrganizationReportFilters {
  @ApiProperty({ required: false })
  report: ReportFilters

  @ApiProperty({ required: false })
  organization: OrganizationFilters
}

export class OrganizationReportSorts {
  @ApiProperty({ required: false })
  report: ReportSorts

  @ApiProperty({ required: false })
  organization: OrganizationSorts
}

export class OrganizationReportFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset

  @ApiProperty({ required: false })
  filter?: OrganizationReportFilters

  @ApiProperty({ required: false })
  sorts?: OrganizationReportSorts

  @ApiProperty({ required: false })
  period?: ReportDto
}
