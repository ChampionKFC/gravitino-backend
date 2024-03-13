import { Controller, Post, Body, UseFilters, Req, UseGuards } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { OrganizationFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayOrganizationResponse } from './response'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'

@ApiBearerAuth()
@ApiTags('Organization')
@Controller('organization')
@UseFilters(AllExceptionsFilter)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('all')
  @ApiOperation({ summary: AppStrings.ORGANIZATION_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_ALL_RESPONSE,
    type: ArrayOrganizationResponse,
  })
  @ApiBody({ required: false, type: OrganizationFilter })
  findAll(@Body() organizationFilter: OrganizationFilter) {
    return this.organizationService.findAll(organizationFilter)
  }

  // @Get('all/:checkpoint_id')
  // @ApiOperation({ summary: AppStrings.ORGANIZATION_ALL_BY_CHECKPOINT_OPERATION })
  // @ApiOkResponse({
  //   description: AppStrings.ORGANIZATION_ALL_BY_CHECKPOINT_RESPONSE,
  //   type: ArrayOrganizationResponse,
  // })
  // findAllByCheckpoint(@Param('checkpoint_id') checkpoint_id: number) {
  //   return this.organizationService.findAllByCheckpoint(checkpoint_id)
  // }

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @ApiOperation({ summary: AppStrings.ORGANIZATION_MY_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_MY_RESPONSE,
    type: ArrayOrganizationResponse,
  })
  @ApiBody({ required: false, type: OrganizationFilter })
  @Post('my')
  findMy(@Body() organizationFilter: OrganizationFilter, @Req() request) {
    return this.organizationService.findMy(organizationFilter, request.user.user_id)
  }
}
