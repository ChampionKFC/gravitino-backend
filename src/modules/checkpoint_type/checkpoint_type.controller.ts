import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, UseFilters } from '@nestjs/common'
import { CheckpointTypeService } from './checkpoint_type.service'
import { CreateCheckpointTypeDto, UpdateCheckpointTypeDto } from './dto'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CheckpointType } from './entities/checkpoint_type.entity'
import { ArrayCheckpointTypeResponse, StatusCheckpointTypeResponse } from './response'
import { CheckpointTypeFilter } from './filters'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'

@ApiBearerAuth()
@ApiTags('Checkpoint Type')
@Controller('checkpoint-type')
@UseFilters(AllExceptionsFilter)
export class CheckpointTypeController {
  constructor(private readonly checkpointTypeService: CheckpointTypeService) {}

  @HasPermissions(PermissionEnum.CheckpointTypeCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiCreatedResponse({
    description: AppStrings.CHECKPOINT_TYPE_CREATED_RESPONSE,
    type: StatusCheckpointTypeResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_TYPE_CREATE_OPERATION })
  @Post()
  create(@Body() createCheckpointTypeDto: CreateCheckpointTypeDto, @Req() request) {
    return this.checkpointTypeService.create(createCheckpointTypeDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @ApiCreatedResponse({
    description: AppStrings.CHECKPOINT_TYPE_ALL_RESPONSE,
    type: ArrayCheckpointTypeResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_TYPE_ALL_OPERATION })
  @ApiBody({ required: false, type: CheckpointTypeFilter })
  @Post('all')
  findAll(@Body() checkpointTypeFilter?: CheckpointTypeFilter) {
    return this.checkpointTypeService.findAll(checkpointTypeFilter)
  }

  @HasPermissions(PermissionEnum.CheckpointTypeUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiCreatedResponse({
    description: AppStrings.CHECKPOINT_TYPE_UPDATE_RESPONSE,
    type: CheckpointType,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_TYPE_UPDATE_OPERATION })
  @Patch()
  update(@Body() updateCheckpointTypeDto: UpdateCheckpointTypeDto, @Req() request) {
    return this.checkpointTypeService.update(updateCheckpointTypeDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.CheckpointTypeDelete)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiCreatedResponse({
    description: AppStrings.CHECKPOINT_TYPE_DELETE_RESPONSE,
    type: CheckpointType,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_TYPE_DELETE_OPERATION })
  @Delete(':id')
  remove(@Param('id') id: number, @Req() request) {
    return this.checkpointTypeService.remove(+id, request.user.user_id)
  }
}
