import { Controller, Post, Body, UseGuards, UseFilters, Param } from '@nestjs/common'
import { ReportService } from './report.service'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { ActiveGuard } from '../auth/guards/active.guard'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayBranchReportResponse } from './response'
import { BranchReportFilter, CheckpointReportFilter } from './filters'

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

  @ApiOperation({ summary: AppStrings.REPORT_BRANCH_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.REPORT_BRANCH_ALL_RESPONSE,
    type: ArrayBranchReportResponse,
  })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Post('checkpoint/:branch_id')
  generateCheckpointReport(@Param('branch_id') branch_id: number, @Body() reportFilter: CheckpointReportFilter) {
    return this.reportService.generateCheckpointReport(branch_id, reportFilter)
  }
}
