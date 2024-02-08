import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, UseFilters } from '@nestjs/common'
import { CheckpointTypeService } from './checkpoint_type.service'
import { CreateCheckpointTypeDto, UpdateCheckpointTypeDto } from './dto'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CheckpointType } from './entities/checkpoint_type.entity'
import { ArrayCheckpointTypeResponse, StatusCheckpointTypeResponse } from './response'
import { CheckpointTypeFilter } from './filters'
import { AllExceptionsFilter } from 'src/common/exception.filter'

@ApiBearerAuth()
@ApiTags('Checkpoint Type')
@Controller('checkpoint-type')
@UseFilters(AllExceptionsFilter)
export class CheckpointTypeController {
  constructor(private readonly checkpointTypeService: CheckpointTypeService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Тип пункта пропуска успешно создан',
    type: StatusCheckpointTypeResponse,
  })
  @ApiOperation({ summary: 'Создание типа пункта пропуска' })
  @Post()
  create(@Body() createCheckpointTypeDto: CreateCheckpointTypeDto, @Req() request) {
    return this.checkpointTypeService.create(createCheckpointTypeDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Список типов пунктов пропуска',
    type: ArrayCheckpointTypeResponse,
  })
  @ApiOperation({ summary: 'Список всех типов пунктов пропуска' })
  @ApiBody({ required: false, type: CheckpointTypeFilter })
  @Post('all')
  findAll(@Body() checkpointTypeFilter?: CheckpointTypeFilter) {
    return this.checkpointTypeService.findAll(checkpointTypeFilter)
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Тип пункта пропуска успешно изменен',
    type: CheckpointType,
  })
  @ApiOperation({ summary: 'Изменение типа пунтка пропуска' })
  @Patch()
  update(@Body() updateCheckpointTypeDto: UpdateCheckpointTypeDto, @Req() request) {
    return this.checkpointTypeService.update(updateCheckpointTypeDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Тип пункта пропуска успешно удален',
    type: CheckpointType,
  })
  @ApiOperation({ summary: 'Удаление типа пунтка пропуска' })
  @Delete(':id')
  remove(@Param('id') id: number, @Req() request) {
    return this.checkpointTypeService.remove(+id, request.user.user_id)
  }
}
