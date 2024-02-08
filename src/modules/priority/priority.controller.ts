import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Get } from '@nestjs/common'
import { PriorityService } from './priority.service'
import { CreatePriorityDto, UpdatePriorityDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { OrderPriority } from './entities/priority.entity'
import { ArrayOrderPriorityResponse, OrderPriorityResponse, StatusOrderPriorityResponse } from './response'
import { OrderPriorityFilter } from './filters'

@ApiBearerAuth()
@Controller('priority')
@ApiTags('Priority')
@UseFilters(AllExceptionsFilter)
export class PriorityController {
  constructor(private readonly priorityService: PriorityService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание приоритета' })
  @ApiCreatedResponse({
    description: 'Приоритет успешно создан',
    type: StatusOrderPriorityResponse,
  })
  @Post()
  create(@Body() createPriorityDto: CreatePriorityDto, @Req() request) {
    return this.priorityService.create(createPriorityDto, request.user.user_id)
  }

  @Post('all')
  @ApiOperation({ summary: 'Список всех приоритетов' })
  @ApiOkResponse({
    description: 'Список приоритетов',
    type: ArrayOrderPriorityResponse,
  })
  @ApiBody({ required: false, type: OrderPriorityFilter })
  findAll(@Body() orderPriorityFilter: OrderPriorityFilter) {
    return this.priorityService.findAll(orderPriorityFilter)
  }

  @Get('all')
  @ApiOperation({ summary: 'Список всех приоритетов' })
  @ApiOkResponse({
    description: 'Список приоритетов',
    type: ArrayOrderPriorityResponse,
  })
  getAll() {
    return this.priorityService.findAll({})
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Изменение приоритета' })
  @ApiOkResponse({
    description: 'Приоритет успешно изменен',
    type: OrderPriority,
  })
  @Patch()
  async update(@Body() updatePriorityDto: UpdatePriorityDto, @Req() request) {
    let foundPriority = null
    if (updatePriorityDto.priority_id) {
      foundPriority = await this.priorityService.findOne(updatePriorityDto.priority_id)
    }
    if (!foundPriority) {
      throw new HttpException(AppError.PRIORITY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    return this.priorityService.update(updatePriorityDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление приоритета' })
  @ApiOkResponse({
    description: 'Приоритет успешно удален',
    type: OrderPriorityResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundPriority = await this.priorityService.findOne(id)
    if (foundPriority == null) {
      throw new HttpException(AppError.PRIORITY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.priorityService.remove(+id, request.user.user_id)
  }
}
