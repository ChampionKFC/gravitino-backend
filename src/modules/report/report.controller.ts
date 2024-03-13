import { Controller, Post, Body, UseGuards, UseFilters, Param, Req } from '@nestjs/common'
import { ReportService } from './report.service'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { ActiveGuard } from '../auth/guards/active.guard'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayBranchReportResponse } from './response'
import { BranchReportFilter, CheckpointReportFilter, OrganizationReportFilter } from './filters'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'

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
  @HasPermissions(PermissionEnum.ReportBranchesCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Post('branch/all')
  generateBranchReport(@Body() reportFilter: BranchReportFilter) {
    return this.reportService.generateBranchReport(reportFilter)
  }

  @ApiOperation({ summary: AppStrings.REPORT_MY_BRANCH_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.REPORT_MY_BRANCH_ALL_RESPONSE,
    type: ArrayBranchReportResponse,
  })
  @HasPermissions(PermissionEnum.ReportBranchCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Post('branch/my')
  generateMyBranchReport(@Body() reportFilter: CheckpointReportFilter, @Req() request) {
    return this.reportService.generateMyBranchReport(reportFilter, request.user.user_id)
  }

  @ApiOperation({ summary: AppStrings.REPORT_CHECKPOINT_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.REPORT_CHECKPOINT_ALL_RESPONSE,
    type: ArrayBranchReportResponse,
  })
  @HasPermissions(PermissionEnum.ReportCheckpointCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Post('checkpoint/:branch_id')
  generateCheckpointReport(@Param('branch_id') branch_id: string, @Body() reportFilter: CheckpointReportFilter) {
    return this.reportService.generateCheckpointReport(branch_id, reportFilter)
  }

  @ApiOperation({ summary: AppStrings.REPORT_ORGANIZATIONS_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.REPORT_ORGANIZATIONS_ALL_RESPONSE,
    type: ArrayBranchReportResponse,
  })
  @HasPermissions(PermissionEnum.ReportOrganizationCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Post('organization/:checkpoint_id')
  generateOrganizationReport(@Param('checkpoint_id') checkpoint_id: string, @Body() reportFilter: OrganizationReportFilter) {
    return this.reportService.generateCheckpointOrganizationReport(checkpoint_id, reportFilter)
  }

  @ApiOperation({ summary: AppStrings.REPORT_MY_ORGANIZATIONS_OPERATION })
  @ApiOkResponse({
    description: AppStrings.REPORT_MY_ORGANIZATIONS_RESPONSE,
    type: ArrayBranchReportResponse,
  })
  @HasPermissions(PermissionEnum.ReportOrganizationCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Post('organization-my')
  generateMyOrganizationsReport(@Body() reportFilter: OrganizationReportFilter, @Req() request) {
    return this.reportService.generateMyOrganizationsReport(reportFilter, request.user.user_id)
  }
}
