import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { PeriodicityService } from './periodicity.service'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { PeriodicityFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayPeriodicityResponse } from './response'

@ApiBearerAuth()
@Controller('periodicity')
@ApiTags('Periodicity')
export class PeriodicityController {
  constructor(private readonly periodicityService: PeriodicityService) {}

  @ApiOperation({ summary: AppStrings.PERIODICITY_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.PERIODICITY_ALL_RESPONSE,
    type: ArrayPeriodicityResponse,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ required: false, type: PeriodicityFilter })
  @Post('all')
  findAll(@Body() periodicityFilter: PeriodicityFilter) {
    return this.periodicityService.findAll(periodicityFilter)
  }

  @ApiOperation({ summary: AppStrings.PERIODICITY_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.PERIODICITY_ALL_RESPONSE,
    type: ArrayPeriodicityResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAll() {
    return this.periodicityService.findAll({})
  }
}
