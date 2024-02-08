import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common'
import { WorkingHoursService } from './working_hours.service'
import { CreateWorkingHourDto, UpdateWorkingHourDto } from './dto'
import { ArrayWorkingHoursResponse, StatusWorkingHoursResponse } from './response'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'

@ApiTags('Working Hours')
@Controller('working-hours')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}

  @ApiCreatedResponse({
    description: 'Часы работы успешно добвлены',
    type: StatusWorkingHoursResponse,
  })
  @ApiOperation({ summary: 'Добавление часов работы' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWorkingHourDto: CreateWorkingHourDto, @Req() request) {
    return this.workingHoursService.create(createWorkingHourDto, request.user.user_id)
  }

  @ApiOkResponse({
    description: 'Список часов работы',
    type: ArrayWorkingHoursResponse,
  })
  @ApiOperation({ summary: 'Получение списка часов работы' })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll() {
    return this.workingHoursService.findAll()
  }

  @ApiOkResponse({
    description: 'Часы работы успешно изменены',
    type: StatusWorkingHoursResponse,
  })
  @ApiOperation({ summary: 'Изменение часов работы' })
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateWorkingHourDto: UpdateWorkingHourDto, @Req() request) {
    const foundWorkingHours = await this.workingHoursService.findOne(updateWorkingHourDto.working_hours_id)
    if (!foundWorkingHours) {
      throw new HttpException(AppError.WORKING_HOURS_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.workingHoursService.update(updateWorkingHourDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Часы работы успешно удалены',
    type: StatusWorkingHoursResponse,
  })
  @ApiOperation({ summary: 'Удаление часов работы' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    const foundWorkingHours = await this.workingHoursService.findOne(+id)
    if (!foundWorkingHours) {
      throw new HttpException(AppError.WORKING_HOURS_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.workingHoursService.remove(+id, request.user.user_id)
  }
}
