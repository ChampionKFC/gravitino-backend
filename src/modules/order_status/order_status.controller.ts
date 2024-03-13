import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Get } from '@nestjs/common'
import { OrderStatusService } from './order_status.service'
import { CreateOrderStatusDto, UpdateOrderStatusDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { OrderStatus } from './entities/order_status.entity'
import { ArrayOrderStatusResponse, StatusOrderStatusResponse } from './response'
import { OrderStatusFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'

@ApiBearerAuth()
@ApiTags('Order Status')
@Controller('order-status')
@UseFilters(AllExceptionsFilter)
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @HasPermissions(PermissionEnum.OrderStatusCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOperation({ summary: AppStrings.ORDER_STATUS_CREATE_OPERATION })
  @ApiCreatedResponse({
    description: AppStrings.ORDER_STATUS_CREATED_RESPONSE,
    type: StatusOrderStatusResponse,
  })
  @Post()
  async create(@Body() createOrderStatusDto: CreateOrderStatusDto, @Req() request) {
    return this.orderStatusService.create(createOrderStatusDto, request.user.user_id)
  }

  @ApiOperation({ summary: AppStrings.ORDER_STATUS_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORDER_STATUS_ALL_RESPONSE,
    type: ArrayOrderStatusResponse,
  })
  @ApiBody({ required: false, type: OrderStatusFilter })
  @Post('all')
  async findAll(@Body() orderStatusFilter: OrderStatusFilter) {
    return this.orderStatusService.findAll(orderStatusFilter)
  }

  @ApiOperation({ summary: AppStrings.ORDER_STATUS_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORDER_STATUS_ALL_RESPONSE,
    type: OrderStatus,
    isArray: true,
  })
  @Get('all')
  async getAll() {
    return this.orderStatusService.findAll({})
  }

  @ApiOperation({ summary: AppStrings.ORDER_STATUS_ALL_ROLE_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORDER_STATUS_ALL_ROLE_RESPONSE,
    type: OrderStatus,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Get('all-by-role')
  async getAllByRole(@Req() request) {
    return this.orderStatusService.findAllByRole(request.user.user_id)
  }

  @HasPermissions(PermissionEnum.OrderStatusUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Patch()
  @ApiOperation({ summary: AppStrings.ORDER_STATUS_UPDATE_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORDER_STATUS_UPDATE_RESPONSE,
    type: OrderStatus,
  })
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

  @HasPermissions(PermissionEnum.OrderStatusDelete)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Delete(':id')
  @ApiOperation({ summary: AppStrings.ORDER_STATUS_DELETE_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORDER_STATUS_DELETE_RESPONSE,
    type: OrderStatus,
  })
  async remove(@Param('id') id: number, @Req() request) {
    const foundStatus = await this.orderStatusService.findOne(id)
    if (!foundStatus) {
      throw new HttpException(AppError.ORDER_STATUS_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    return this.orderStatusService.remove(+id, request.user.user_id)
  }
}
