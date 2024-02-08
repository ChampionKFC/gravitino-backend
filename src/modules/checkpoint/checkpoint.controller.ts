import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Query } from '@nestjs/common'
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

@ApiBearerAuth()
@ApiTags('Checkpoint')
@Controller('checkpoint')
@UseFilters(AllExceptionsFilter)
export class CheckpointController {
  constructor(
    private readonly checkpointService: CheckpointService,
    private readonly branchService: BranchService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: AppStrings.CHECKPOINT_CREATED_RESPONSE,
    type: StatusCheckpointResponse,
  })
  @ApiOperation({ summary: AppStrings.CHECKPOINT_CREATE_OPERATION })
  @Post()
  async create(@Body() createCheckpointDto: CreateCheckpointDto, @Req() request) {
    const foundBranch = await this.branchService.findOne(createCheckpointDto.branch_id)
    if (!foundBranch) {
      throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.checkpointService.create(createCheckpointDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
      const foundBranch = await this.branchService.findOne(updateCheckpointDto.branch_id)
      if (!foundBranch) {
        throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.checkpointService.update(updateCheckpointDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
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
}
