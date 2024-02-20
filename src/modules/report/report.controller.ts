import { Controller, Post, Body, UseGuards, UseFilters } from '@nestjs/common'
import { ReportService } from './report.service'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { ActiveGuard } from '../auth/guards/active.guard'
import { ReportDto } from './dto'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayBranchReportResponse } from './response'

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
  generateBranchReport(@Body() reportDto: ReportDto) {
    return this.reportService.generateBranchReport(reportDto)
  }
}
