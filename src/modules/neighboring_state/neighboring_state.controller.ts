import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common'
import { NeighboringStateService } from './neighboring_state.service'
import { CreateNeighboringStateDto, UpdateNeighboringStateDto } from './dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { StatusNeighboringStateResponse } from './response'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { NeighboringState } from './entities/neighboring_state.entity'
import { AppError } from 'src/common/constants/error'

@ApiTags('Neighboring State')
@Controller('neighboring-state')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class NeighboringStateController {
  constructor(private readonly neighboringStateService: NeighboringStateService) {}

  @ApiCreatedResponse({
    description: 'Приграничное гос-во успешно создано',
    type: StatusNeighboringStateResponse,
  })
  @ApiOperation({ summary: 'Создание приграничного гос-ва' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNeighboringStateDto: CreateNeighboringStateDto, @Req() request) {
    return this.neighboringStateService.create(createNeighboringStateDto, request.user.user_id)
  }

  @ApiOkResponse({
    description: 'Список приграничных государств',
    type: NeighboringState,
    isArray: true,
  })
  @ApiOperation({ summary: 'Получение списка приграничных государств' })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll() {
    return this.neighboringStateService.findAll()
  }

  @ApiOkResponse({
    description: 'Приграничное гос-во успешно изменено',
    type: StatusNeighboringStateResponse,
  })
  @ApiOperation({ summary: 'Изменение приграничного государства' })
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateNeighboringStateDto: UpdateNeighboringStateDto, @Req() request) {
    const foundNeighboringState = await this.neighboringStateService.findOne(updateNeighboringStateDto.neighboring_state_id)
    if (!foundNeighboringState) {
      throw new HttpException(AppError.NEIGHBORING_STATE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.neighboringStateService.update(updateNeighboringStateDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Приграничное гос-во успешно удалено',
    type: StatusNeighboringStateResponse,
  })
  @ApiOperation({ summary: 'Удаление приграничного государства' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    const foundNeighboringState = await this.neighboringStateService.findOne(+id)
    if (!foundNeighboringState) {
      throw new HttpException(AppError.NEIGHBORING_STATE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.neighboringStateService.remove(+id, request.user.user_id)
  }
}
