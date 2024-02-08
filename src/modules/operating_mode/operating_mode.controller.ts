import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common'
import { OperatingModeService } from './operating_mode.service'
import { CreateOperatingModeDto, UpdateOperatingModeDto } from './dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { ArrayOperatingModeResponse, StatusOperatingModeResponse } from './response'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'

@ApiTags('Operating Mode')
@Controller('operating-mode')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class OperatingModeController {
  constructor(private readonly operatingModeService: OperatingModeService) {}

  @ApiCreatedResponse({
    description: 'Режим работы успешно создан',
    type: StatusOperatingModeResponse,
  })
  @ApiOperation({ summary: 'Создание режима работы' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOperatingModeDto: CreateOperatingModeDto, @Req() request) {
    return this.operatingModeService.create(createOperatingModeDto, request.user.user_id)
  }

  @ApiOkResponse({
    description: 'Список режимов работы',
    type: ArrayOperatingModeResponse,
  })
  @ApiOperation({ summary: 'Получение списка режимов работы' })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll() {
    return this.operatingModeService.findAll()
  }

  @ApiOkResponse({
    description: 'Режим работы успешно изменен',
    type: StatusOperatingModeResponse,
  })
  @ApiOperation({ summary: 'Изменение режима работы' })
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateOperatingModeDto: UpdateOperatingModeDto, @Req() request) {
    const foundOperatingMode = await this.operatingModeService.findOne(updateOperatingModeDto.operating_mode_id)
    if (!foundOperatingMode) {
      throw new HttpException(AppError.OPERATING_MODE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.operatingModeService.update(updateOperatingModeDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Реждим работы успешно удален',
    type: StatusOperatingModeResponse,
  })
  @ApiOperation({ summary: 'Удаление режима работы' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    const foundOperatingMode = await this.operatingModeService.findOne(+id)
    if (!foundOperatingMode) {
      throw new HttpException(AppError.OPERATING_MODE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.operatingModeService.remove(+id, request.user.user_id)
  }
}
