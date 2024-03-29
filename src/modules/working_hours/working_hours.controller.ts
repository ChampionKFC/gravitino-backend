import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common'
import { WorkingHoursService } from './working_hours.service'
import { CreateWorkingHourDto, UpdateWorkingHourDto } from './dto'
import { ArrayWorkingHoursResponse, StatusWorkingHoursResponse } from './response'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'

@ApiTags('Working Hours')
@Controller('working-hours')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}

  @ApiCreatedResponse({
    description: AppStrings.WORKING_HOURS_CREATED_RESPONSE,
    type: StatusWorkingHoursResponse,
  })
  @ApiOperation({ summary: AppStrings.WORKING_HOURS_CREATE_OPERATION })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Post()
  create(@Body() createWorkingHourDto: CreateWorkingHourDto, @Req() request) {
    return this.workingHoursService.create(createWorkingHourDto, request.user.user_id)
  }

  @ApiOkResponse({
    description: AppStrings.WORKING_HOURS_ALL_RESPONSE,
    type: ArrayWorkingHoursResponse,
  })
  @ApiOperation({ summary: AppStrings.WORKING_HOURS_ALL_OPERATION })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Get('all')
  findAll() {
    return this.workingHoursService.findAll()
  }

  @ApiOkResponse({
    description: AppStrings.WORKING_HOURS_UPDATE_RESPONSE,
    type: StatusWorkingHoursResponse,
  })
  @ApiOperation({ summary: AppStrings.WORKING_HOURS_UPDATE_OPERATION })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Patch()
  async update(@Body() updateWorkingHourDto: UpdateWorkingHourDto, @Req() request) {
    const foundWorkingHours = await this.workingHoursService.findOne(updateWorkingHourDto.working_hours_id)
    if (!foundWorkingHours) {
      throw new HttpException(AppError.WORKING_HOURS_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.workingHoursService.update(updateWorkingHourDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.WORKING_HOURS_DELETE_RESPONSE,
    type: StatusWorkingHoursResponse,
  })
  @ApiOperation({ summary: AppStrings.WORKING_HOURS_DELETE_OPERATION })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    const foundWorkingHours = await this.workingHoursService.findOne(+id)
    if (!foundWorkingHours) {
      throw new HttpException(AppError.WORKING_HOURS_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.workingHoursService.remove(+id, request.user.user_id)
  }
}
