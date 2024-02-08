import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Query } from '@nestjs/common'
import { OrderService } from './order.service'
import { BulkCreateOrderDto, UpdateOrderDto, UpdateStatusDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { OrganizationService } from '../organization/organization.service'
import { UsersService } from '../users/users.service'
import { OrderStatusService } from '../order_status/order_status.service'
import { PriorityService } from '../priority/priority.service'
import { TaskService } from '../task/task.service'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { Order } from './entities/order.entity'
import { StatusOrderResponse } from './response'
import { MyOrdersFilter, OrderFilter } from './filters'
import { BranchService } from '../branch/branch.service'
import { FacilityService } from '../facility/facility.service'
import { AppStrings } from 'src/common/constants/strings'

@Controller('order')
@ApiTags('Order')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly taskService: TaskService,
    private readonly checkpointService: CheckpointService,
    private readonly facilityService: FacilityService,
    private readonly organizationService: OrganizationService,
    private readonly usersService: UsersService,
    private readonly orderStatusService: OrderStatusService,
    private readonly priorityService: PriorityService,
    private readonly branchService: BranchService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: AppStrings.ORDER_CREATED_RESPONSE,
    type: StatusOrderResponse,
  })
  @ApiOperation({ summary: AppStrings.ORDER_CREATE_OPERATION })
  @Post()
  async create(@Body() createOrderDto: BulkCreateOrderDto, @Req() request) {
    const branch_ids = createOrderDto.branch_ids
    if (branch_ids) {
      for (let index = 0; index < branch_ids.length; index++) {
        const element = branch_ids[index]

        const foundBranch = await this.branchService.findOne(+element)
        if (!foundBranch) {
          throw new HttpException(`${AppError.BRANCH_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
        }
      }
    }

    const checkpoint_ids = createOrderDto.checkpoint_ids
    if (checkpoint_ids) {
      for (let index = 0; index < checkpoint_ids.length; index++) {
        const element = checkpoint_ids[index]

        const foundCheckpoint = await this.checkpointService.findOne(+element)
        if (!foundCheckpoint) {
          throw new HttpException(`${AppError.CHECKPOINT_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
        }
      }
    }

    const facility_ids = createOrderDto.facility_ids
    if (facility_ids) {
      for (let index = 0; index < facility_ids.length; index++) {
        const element = facility_ids[index]

        const foundFacility = await this.facilityService.findOne(+element)
        if (!foundFacility) {
          throw new HttpException(`${AppError.FACILITY_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
        }
      }
    }

    const executor_ids = createOrderDto.executor_ids
    if (executor_ids.length == 0) {
      throw new HttpException(`${AppError.ORGANIZATION_EXECUTOR_NULL}`, HttpStatus.NOT_FOUND)
    } else {
      for (let index = 0; index < executor_ids.length; index++) {
        const element = executor_ids[index]

        const foundExecutor = await this.organizationService.findOne(+element)
        if (!foundExecutor) {
          throw new HttpException(`${AppError.ORGANIZATION_EXECUTOR_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
        }
      }
    }

    const foundPriority = await this.priorityService.findOne(createOrderDto.priority_id)
    if (!foundPriority) {
      throw new HttpException(AppError.PRIORITY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.orderService.bulkCreate(createOrderDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.ORDER_ALL_RESPONSE,
    type: ArrayOrderResponse,
  })
  @ApiOperation({ summary: AppStrings.ORDER_ALL_OPERATION })
  @ApiBody({ required: false, type: OrderFilter })
  @Post('all')
  async findAll(@Body() orderFilter: OrderFilter) {
    return this.orderService.findAll(orderFilter)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.ORDER_ALL_BY_BRANCH_RESPONSE,
    type: ArrayOrderResponse,
  })
  @ApiOperation({ summary: AppStrings.ORDER_ALL_BY_BRANCH_OPERATION })
  @ApiBody({ required: false, type: OrderFilter })
  @Post('all-by-branch')
  async findAllByBranch(@Query('branch_ids') branch_ids: number[], @Body() orderFilter: OrderFilter) {
    for (let index = 0; index < branch_ids.length; index++) {
      const element = branch_ids[index]

      const foundBranch = await this.branchService.findOne(+element)
      if (!foundBranch) {
        throw new HttpException(`${AppError.BRANCH_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
      }
    }

    return this.orderService.findAllByBranch(branch_ids, orderFilter)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.ORDER_ALL_BY_CHECKPOINT_RESPONSE,
    type: ArrayOrderResponse,
  })
  @ApiOperation({ summary: AppStrings.ORDER_ALL_BY_CHECKPOINT_OPERATION })
  @ApiBody({ required: false, type: OrderFilter })
  @Post('all-by-checkpoint')
  async findAllByCheckpoint(@Query('checkpoint_ids') checkpoint_ids: number[], @Body() orderFilter: OrderFilter) {
    for (let index = 0; index < checkpoint_ids.length; index++) {
      const element = checkpoint_ids[index]

      const foundCheckpoint = await this.checkpointService.findOne(+element)

      if (!foundCheckpoint) {
        throw new HttpException(`${AppError.CHECKPOINT_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
      }
    }

    return this.orderService.findAllByCheckpoint(checkpoint_ids, orderFilter)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.ORDER_ALL_MY_RESPONSE,
    type: ArrayOrderResponse,
  })
  @ApiOperation({ summary: AppStrings.ORDER_ALL_MY_OPERATION })
  @Post('my')
  findMy(@Body() myOrdersFilter: MyOrdersFilter, @Req() request) {
    return this.orderService.findMy(myOrdersFilter, request.user)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.ORDER_UPDATE_RESPONSE,
    type: Order,
  })
  @ApiOperation({ summary: AppStrings.ORDER_UPDATE_OPERATION })
  @Patch()
  async update(@Body() updateOrderDto: UpdateOrderDto, @Req() request) {
    let foundOrder = null
    if (updateOrderDto.order_id) {
      foundOrder = await this.orderService.findOne(updateOrderDto.order_id)
    }
    if (!foundOrder) {
      throw new HttpException(AppError.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (updateOrderDto.task_id) {
      const foundTask = await this.taskService.findOne(updateOrderDto.task_id)
      if (!foundTask) {
        throw new HttpException(AppError.TASK_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }
    if (updateOrderDto.facility_id) {
      const foundFacility = await this.facilityService.findOne(updateOrderDto.facility_id)
      if (!foundFacility) {
        throw new HttpException(AppError.FACILITY_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }
    if (updateOrderDto.executor_id) {
      const foundOrganization = await this.organizationService.findOne(updateOrderDto.executor_id)
      if (!foundOrganization) {
        throw new HttpException(AppError.ORGANIZATION_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }
    if (updateOrderDto.completed_by) {
      const foundCompleted = await this.usersService.findOne(updateOrderDto.completed_by)
      if (!foundCompleted) {
        throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }
    if (updateOrderDto.creator_id) {
      const foundCreator = await this.usersService.findOne(updateOrderDto.creator_id)
      if (!foundCreator) {
        throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }
    if (updateOrderDto.order_status_id) {
      const foundOrderStatus = await this.orderStatusService.findOne(updateOrderDto.order_status_id)
      if (!foundOrderStatus) {
        throw new HttpException(AppError.ORDER_STATUS_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }
    if (updateOrderDto.priority_id) {
      const foundPriority = await this.priorityService.findOne(updateOrderDto.priority_id)
      if (!foundPriority) {
        throw new HttpException(AppError.PRIORITY_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.orderService.update(updateOrderDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.ORDER_STATUS_UPDATE_RESPONSE,
    type: StatusOrderResponse,
  })
  @ApiOperation({ summary: AppStrings.ORDER_STATUS_UPDATE_OPERATION })
  @Patch('update_status')
  async updateStatus(@Body() updateOrderStatusDto: UpdateStatusDto, @Req() request) {
    let foundOrder = null
    if (updateOrderStatusDto.order_id) {
      foundOrder = await this.orderService.findOne(updateOrderStatusDto.order_id)
    }
    if (!foundOrder) {
      throw new HttpException(AppError.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    if (updateOrderStatusDto.order_status_id) {
      const foundOrderStatus = await this.orderStatusService.findOne(updateOrderStatusDto.order_status_id)
      if (!foundOrderStatus) {
        throw new HttpException(AppError.ORDER_STATUS_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.orderService.changeStatus(updateOrderStatusDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.ORDER_DELETE_RESPONSE,
    type: StatusOrderResponse,
  })
  @ApiOperation({ summary: AppStrings.ORDER_DELETE_OPERATION })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundOrder = await this.orderService.findOne(id)
    if (!foundOrder) {
      throw new HttpException(AppError.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.orderService.remove(+id, request.user.user_id)
  }
}
