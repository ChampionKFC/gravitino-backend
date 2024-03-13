import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  UseFilters,
  Query,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common'
import { CheckpointService } from './checkpoint.service'
import { CreateCheckpointDto, UpdateCheckpointDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { BranchService } from '../branch/branch.service'
import { ArrayCheckpointResponse, StatusCheckpointResponse } from './response'
import { Checkpoint } from './entities/checkpoint.entity'
import { CheckpointFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { CheckpointTypeService } from '../checkpoint_type/checkpoint_type.service'
import { NeighboringStateService } from '../neighboring_state/neighboring_state.service'
import { OperatingModeService } from '../operating_mode/operating_mode.service'
import { WorkingHoursService } from '../working_hours/working_hours.service'

@ApiBearerAuth()
@ApiTags('Checkpoint')
@Controller('checkpoint')
@UseFilters(AllExceptionsFilter)
export class CheckpointController {
  constructor(
    private readonly checkpointService: CheckpointService,
    private readonly branchService: BranchService,
    private readonly neighboringStateService: NeighboringStateService,
    private readonly checkpointTypeService: CheckpointTypeService,
    private readonly operatingModeService: OperatingModeService,
    private readonly workingHoursService: WorkingHoursService,
  ) {}

  @HasPermissions(PermissionEnum.CheckpointCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiCreatedResponse({
    description: AppStrings.CHECKPOINT_CREATED_RESPONSE,
    type: StatusCheckpointResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_CREATE_OPERATION })
  @Post()
  async create(@Body() createCheckpointDto: CreateCheckpointDto, @Req() request) {
    const branch = await this.branchService.findOne(createCheckpointDto.branch_id)
    if (!branch) {
      throw new NotFoundException(AppError.BRANCH_NOT_FOUND)
    }

    if (createCheckpointDto.neighboring_state_id) {
      const neighboringState = await this.neighboringStateService.findOne(createCheckpointDto.neighboring_state_id)
      if (!neighboringState) {
        throw new NotFoundException(AppError.NEIGHBORING_STATE_NOT_FOUND)
      }
    }

    const checkpointType = await this.checkpointTypeService.findOne(createCheckpointDto.checkpoint_type_id)
    if (!checkpointType) {
      throw new NotFoundException(AppError.CHECKPOINT_TYPE_NOT_FOUND)
    }

    const operatingMode = await this.operatingModeService.findOne(createCheckpointDto.operating_mode_id)
    if (!operatingMode) {
      throw new NotFoundException(AppError.OPERATING_MODE_NOT_FOUND)
    }

    const workingHours = await this.workingHoursService.findOne(createCheckpointDto.working_hours_id)
    if (!workingHours) {
      throw new NotFoundException(AppError.WORKING_HOURS_NOT_FOUND)
    }

    return this.checkpointService.create(createCheckpointDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.CheckpointGet)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.CHECKPOINT_ALL_RESPONSE,
    type: ArrayCheckpointResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_ALL_RESPONSE })
  @ApiBody({ required: false, type: CheckpointFilter })
  @Post('all')
  async findAll(@Body() checkpointFilter?: CheckpointFilter) {
    return this.checkpointService.findAll(checkpointFilter)
  }

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.CHECKPOINT_ALL_RESPONSE,
    type: ArrayCheckpointResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_ALL_RESPONSE })
  @ApiBody({ required: false, type: CheckpointFilter })
  @Post('my')
  async findMy(@Body() checkpointFilter: CheckpointFilter, @Req() request) {
    return this.checkpointService.findMy(request.user.user_id, checkpointFilter)
  }

  @HasPermissions(PermissionEnum.CheckpointGet)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.CHECKPOINT_ALL_BY_BRANCH_RESPONSE,
    type: ArrayCheckpointResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_ALL_BY_BRANCH_OPERATION })
  @ApiBody({ required: false, type: CheckpointFilter })
  @Post('all-by-branch')
  async findAllByBranch(@Query('branch_ids') branch_ids: number[], @Body() checkpointFilter?: CheckpointFilter) {
    for (let index = 0; index < branch_ids.length; index++) {
      const element = branch_ids[index]

      const foundBranch = await this.branchService.findOne(+element)
      if (!foundBranch) {
        throw new HttpException(`${AppError.BRANCH_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
      }
    }

    return this.checkpointService.findAllByBranch(branch_ids, checkpointFilter)
  }

  @HasPermissions(PermissionEnum.CheckpointUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.CHECKPOINT_UPDATE_RESPONSE,
    type: Checkpoint,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_UPDATE_OPERATION })
  @Patch()
  async update(@Body() updateCheckpointDto: UpdateCheckpointDto, @Req() request) {
    let foundCheckpoint = null
    if (updateCheckpointDto.checkpoint_id) {
      foundCheckpoint = await this.checkpointService.findOne(updateCheckpointDto.checkpoint_id)
    }
    if (!foundCheckpoint) {
      throw new HttpException(AppError.CHECKPOINT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (updateCheckpointDto.branch_id) {
      const branch = await this.branchService.findOne(updateCheckpointDto.branch_id)
      if (!branch) {
        throw new NotFoundException(AppError.BRANCH_NOT_FOUND)
      }
    }

    if (updateCheckpointDto.neighboring_state_id) {
      const neighboringState = await this.neighboringStateService.findOne(updateCheckpointDto.neighboring_state_id)
      if (!neighboringState) {
        throw new NotFoundException(AppError.NEIGHBORING_STATE_NOT_FOUND)
      }
    }
    if (updateCheckpointDto.checkpoint_type_id) {
      const checkpointType = await this.checkpointTypeService.findOne(updateCheckpointDto.checkpoint_type_id)
      if (!checkpointType) {
        throw new NotFoundException(AppError.CHECKPOINT_TYPE_NOT_FOUND)
      }
    }
    if (updateCheckpointDto.operating_mode_id) {
      const operatingMode = await this.operatingModeService.findOne(updateCheckpointDto.operating_mode_id)
      if (!operatingMode) {
        throw new NotFoundException(AppError.OPERATING_MODE_NOT_FOUND)
      }
    }
    if (updateCheckpointDto.working_hours_id) {
      const workingHours = await this.workingHoursService.findOne(updateCheckpointDto.working_hours_id)
      if (!workingHours) {
        throw new NotFoundException(AppError.WORKING_HOURS_NOT_FOUND)
      }
    }

    return this.checkpointService.update(updateCheckpointDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.CheckpointDelete)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.CHECKPOINT_DELETE_RESPONSE,
    type: StatusCheckpointResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_DELETE_OPERATION })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundCheckpoint = await this.checkpointService.findOne(id)
    if (!foundCheckpoint) {
      throw new HttpException(AppError.CHECKPOINT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.checkpointService.remove(+id, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.CheckpointCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.CHECKPOINT_IMPORT_RESPONSE,
    type: StatusCheckpointResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_IMPORT_OPERATION })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!Boolean(file.mimetype.match(/(xls|xlsx|csv)/))) callback(null, false)
        callback(null, true)
      },
    }),
  )
  @Post('import')
  async import(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request,
  ) {
    return this.checkpointService.import(file, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.CheckpointCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.CHECKPOINT_IMPORT_UPLOAD_RESPONSE,
    type: StatusCheckpointResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_IMPORT_UPLOAD_OPERATION })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!Boolean(file.mimetype.match(/(xls|xlsx|csv)/))) callback(null, false)
        callback(null, true)
      },
    }),
  )
  @Post('upload-import')
  async uploadImport(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.checkpointService.previewImport(file)
  }
}
