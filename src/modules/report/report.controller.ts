import { Controller, Post, Body, UseGuards, UseFilters, Param } from '@nestjs/common'
import { ReportService } from './report.service'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { ActiveGuard } from '../auth/guards/active.guard'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayBranchReportResponse } from './response'
import { BranchReportFilter, CheckpointReportFilter, OrganizationReportFilter } from './filters'

@ApiBearerAuth()
@ApiTags('report')
@Controller('report')
@UseFilters(AllExceptionsFilter)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiOperation({ summary: AppStrings.REPORT_BRANCH_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.REPORT_BRANCH_ALL_RESPONSE,
    type: ArrayBranchReportResponse,
  })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Post('branch/all')
  generateBranchReport(@Body() reportFilter: BranchReportFilter) {
    return this.reportService.generateBranchReport(reportFilter)
  }

  @ApiOperation({ summary: AppStrings.REPORT_CHECKPOINT_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.REPORT_CHECKPOINT_ALL_RESPONSE,
    type: ArrayBranchReportResponse,
  })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Post('checkpoint/:branch_id')
  generateCheckpointReport(@Param('branch_id') branch_id: string, @Body() reportFilter: CheckpointReportFilter) {
    return this.reportService.generateCheckpointReport(branch_id, reportFilter)
  }

  @ApiOperation({ summary: AppStrings.REPORT_ORGANIZATIONS_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.REPORT_ORGANIZATIONS_ALL_RESPONSE,
    type: ArrayBranchReportResponse,
  })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Post('organization/:checkpoint_id')
  generateOrganizationReport(@Param('checkpoint_id') checkpoint_id: string, @Body() reportFilter: OrganizationReportFilter) {
    return this.reportService.generateOrganizationReport(checkpoint_id, reportFilter)
  }
}
