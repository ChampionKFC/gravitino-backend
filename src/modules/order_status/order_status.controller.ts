import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Get } from '@nestjs/common'
import { OrderStatusService } from './order_status.service'
import { CreateOrderStatusDto, UpdateOrderStatusDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { OrderStatus } from './entities/order_status.entity'
import { ArrayOrderStatusResponse, StatusOrderStatusResponse } from './response'
import { OrderStatusFilter } from './filters'

@ApiBearerAuth()
@ApiTags('Order Status')
@Controller('order-status')
@UseFilters(AllExceptionsFilter)
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание статуса заказа' })
  @ApiCreatedResponse({
    description: 'Статус заказа успешно создан!',
    type: StatusOrderStatusResponse,
  })
  @Post()
  async create(@Body() createOrderStatusDto: CreateOrderStatusDto, @Req() request) {
    return this.orderStatusService.create(createOrderStatusDto, request.user.user_id)
  }

  @ApiOperation({ summary: 'Список всех статусов заказа' })
  @ApiOkResponse({
    description: 'Список статусов заказа',
    type: ArrayOrderStatusResponse,
  })
  @ApiBody({ required: false, type: OrderStatusFilter })
  @Post('all')
  async findAll(@Body() orderStatusFilter: OrderStatusFilter) {
    return this.orderStatusService.findAll(orderStatusFilter)
  }

  @ApiOperation({ summary: 'Список всех статусов заказа' })
  @ApiOkResponse({
    description: 'Список статусов заказа',
    type: OrderStatus,
    isArray: true,
  })
  @Get('all')
  async getAll() {
    return this.orderStatusService.findAll({})
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Изменение статуса заказа' })
  @ApiOkResponse({
    description: 'Статус заказа успешно изменен',
    type: OrderStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус не существует!' })
  @ApiResponse({ status: 403, description: 'Forbidden!' })
  async update(@Body() updateOrderStatusDto: UpdateOrderStatusDto, @Req() request) {
    let foundStatus = null
    if (updateOrderStatusDto.order_status_id) {
      foundStatus = await this.orderStatusService.findOne(updateOrderStatusDto.order_status_id)
    }

    if (!foundStatus) {
      throw new HttpException(AppError.ORDER_STATUS_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.orderStatusService.update(updateOrderStatusDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Удаление статуса заказа' })
  @ApiOkResponse({
    description: 'Статус заказа успешно удален',
    type: OrderStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус не существует!' })
  async remove(@Param('id') id: number, @Req() request) {
    const foundStatus = await this.orderStatusService.findOne(id)
    if (!foundStatus) {
      throw new HttpException(AppError.ORDER_STATUS_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    return this.orderStatusService.remove(+id, request.user.user_id)
  }
}
