import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters } from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto, UpdateTaskDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { CategoryService } from '../category/category.service'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { Task } from './entities/task.entity'
import { ArrayTaskResponse, StatusTaskResponse } from './response'
import { TaskFilter } from './filters'
import { BranchService } from '../branch/branch.service'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { FacilityService } from '../facility/facility.service'
import { OrganizationService } from '../organization/organization.service'

@ApiBearerAuth()
@ApiTags('Task')
@Controller('task')
@UseFilters(AllExceptionsFilter)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly categoryService: CategoryService,
    private readonly branchService: BranchService,
    private readonly checkpointService: CheckpointService,
    private readonly facilityService: FacilityService,
    private readonly organizationService: OrganizationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Заказы созданы',
    type: StatusTaskResponse,
  })
  @ApiOperation({ summary: 'Создание плановой задачи' })
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() request) {
    const foundCategory = await this.categoryService.findOne(createTaskDto.category_id)
    if (!foundCategory) {
      throw new HttpException(AppError.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const branch_ids = createTaskDto.branch_ids
    if (branch_ids) {
      for (let index = 0; index < branch_ids.length; index++) {
        const element = branch_ids[index]

        const foundBranch = await this.branchService.findOne(+element)
        if (!foundBranch) {
          throw new HttpException(`${AppError.BRANCH_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
        }
      }
    }

    const checkpoint_ids = createTaskDto.checkpoint_ids
    if (checkpoint_ids) {
      for (let index = 0; index < checkpoint_ids.length; index++) {
        const element = checkpoint_ids[index]

        const foundCheckpoint = await this.checkpointService.findOne(+element)
        if (!foundCheckpoint) {
          throw new HttpException(`${AppError.CHECKPOINT_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
        }
      }
    }

    const facility_ids = createTaskDto.facility_ids
    if (facility_ids) {
      for (let index = 0; index < facility_ids.length; index++) {
        const element = facility_ids[index]

        const foundFacility = await this.facilityService.findOne(+element)
        if (!foundFacility) {
          throw new HttpException(`${AppError.FACILITY_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
        }
      }
    }

    const executor_ids = createTaskDto.executor_ids
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

    return this.taskService.create(createTaskDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Список задач',
    type: ArrayTaskResponse,
  })
  @ApiOperation({ summary: 'Список всех задач' })
  @ApiBody({ required: false, type: TaskFilter })
  @Post('all')
  async findAll(@Body() taskFilter: TaskFilter) {
    return this.taskService.findAll(taskFilter)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Задача успешно изменена',
    type: Task,
  })
  @ApiOperation({ summary: 'Изменение задачи' })
  @Patch()
  async update(@Body() updateTaskDto: UpdateTaskDto, @Req() request) {
    let foundTask = null
    if (updateTaskDto.task_id) {
      foundTask = await this.taskService.findOne(updateTaskDto.task_id)
    }

    if (!foundTask) {
      throw new HttpException(AppError.TASK_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (updateTaskDto.category_id) {
      const foundCategory = await this.categoryService.findOne(updateTaskDto.category_id)
      if (!foundCategory) {
        throw new HttpException(AppError.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.taskService.update(updateTaskDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Задача успешно удалена',
    type: StatusTaskResponse,
  })
  @ApiOperation({ summary: 'Удаление задачи' })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundTask = await this.taskService.findOne(id)
    if (!foundTask) {
      throw new HttpException(AppError.TASK_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.taskService.remove(+id, request.user.user_id)
  }
}
