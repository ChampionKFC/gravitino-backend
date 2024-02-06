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
} from '@nestjs/common';
import { CheckpointService } from './checkpoint.service';
import { CreateCheckpointDto, UpdateCheckpointDto } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AppError } from 'src/common/constants/error';
import { AllExceptionsFilter } from 'src/common/exception.filter';
import { BranchService } from '../branch/branch.service';
import { StatusCheckpointResponse } from './response';
import { Checkpoint } from './entities/checkpoint.entity';
import { CheckpointFilter } from './filters';

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
    description: 'Пункт пропуска успешно создан',
    type: StatusCheckpointResponse,
  })
  @ApiOperation({ summary: 'Создание пункта пропуска' })
  @Post()
  async create(
    @Body() createCheckpointDto: CreateCheckpointDto,
    @Req() request,
  ) {
    const foundBranch = await this.branchService.findOne(
      createCheckpointDto.branch_id,
    );
    if (!foundBranch) {
      throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.checkpointService.create(
      createCheckpointDto,
      request.user.user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Список пунтков пропуска',
    type: Checkpoint,
    isArray: true,
  })
  @ApiOperation({ summary: 'Список всех пунтков пропуска' })
  @ApiBody({ required: false, type: CheckpointFilter })
  @Post('all')
  async findAll(@Body() checkpointFilter?: CheckpointFilter) {
    return this.checkpointService.findAll(checkpointFilter);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Список всех пунктов пропуска по ID филиалов',
    type: Checkpoint,
    isArray: true,
  })
  @ApiOperation({ summary: 'Список всех пунктов пропуска по ID филиалов' })
  @ApiBody({ required: false, type: CheckpointFilter })
  @Post('all-by-branch')
  async findAllByBranch(
    @Query('branch_ids') branch_ids: number[],
    @Body() checkpointFilter?: CheckpointFilter,
  ) {
    for (let index = 0; index < branch_ids.length; index++) {
      const element = branch_ids[index];

      const foundBranch = await this.branchService.findOne(+element);
      if (!foundBranch) {
        throw new HttpException(
          `${AppError.BRANCH_NOT_FOUND} (ID: ${element})`,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    return this.checkpointService.findAllByBranch(branch_ids, checkpointFilter);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Пункт пропуска успешно изменен',
    type: Checkpoint,
  })
  @ApiOperation({ summary: 'Изменение пункта пропуска' })
  @Patch()
  async update(
    @Body() updateCheckpointDto: UpdateCheckpointDto,
    @Req() request,
  ) {
    let foundCheckpoint = null;
    if (updateCheckpointDto.checkpoint_id) {
      foundCheckpoint = await this.checkpointService.findOne(
        updateCheckpointDto.checkpoint_id,
      );
    }
    if (!foundCheckpoint) {
      throw new HttpException(
        AppError.CHECKPOINT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateCheckpointDto.branch_id) {
      const foundBranch = await this.branchService.findOne(
        updateCheckpointDto.branch_id,
      );
      if (!foundBranch) {
        throw new HttpException(
          AppError.BRANCH_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    return this.checkpointService.update(
      updateCheckpointDto,
      request.user.user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Пункт пропуска успешно удалён',
    type: StatusCheckpointResponse,
  })
  @ApiOperation({ summary: 'Удаление пункта пропуска' })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundCheckpoint = await this.checkpointService.findOne(id);
    if (!foundCheckpoint) {
      throw new HttpException(
        AppError.CHECKPOINT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.checkpointService.remove(+id, request.user.user_id);
  }
}
