import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common'
import { NeighboringStateService } from './neighboring_state.service'
import { CreateNeighboringStateDto, UpdateNeighboringStateDto } from './dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { ArrayNeighboringStateResponse, StatusNeighboringStateResponse } from './response'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { HasPermissions } from '../auth/guards/permissions.decorator'

@ApiTags('Neighboring State')
@Controller('neighboring-state')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class NeighboringStateController {
  constructor(private readonly neighboringStateService: NeighboringStateService) {}

  @HasPermissions(PermissionEnum.NeighboringStateCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiCreatedResponse({
    description: AppStrings.NEIGHBORING_STATE_CREATED_RESPONSE,
    type: StatusNeighboringStateResponse,
  })
  @ApiOperation({ summary: AppStrings.NEIGHBORING_STATE_CREATE_OPERATION })
  @Post()
  create(@Body() createNeighboringStateDto: CreateNeighboringStateDto, @Req() request) {
    return this.neighboringStateService.create(createNeighboringStateDto, request.user.user_id)
  }

  @ApiOkResponse({
    description: AppStrings.NEIGHBORING_STATE_ALL_RESPONSE,
    type: ArrayNeighboringStateResponse,
  })
  @ApiOperation({ summary: AppStrings.NEIGHBORING_STATE_ALL_OPERATION })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Get('all')
  findAll() {
    return this.neighboringStateService.findAll()
  }

  @HasPermissions(PermissionEnum.NeighboringStateUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.NEIGHBORING_STATE_UPDATE_RESPONSE,
    type: StatusNeighboringStateResponse,
  })
  @ApiOperation({ summary: AppStrings.NEIGHBORING_STATE_UPDATE_OPERATION })
  @Patch()
  async update(@Body() updateNeighboringStateDto: UpdateNeighboringStateDto, @Req() request) {
    const foundNeighboringState = await this.neighboringStateService.findOne(updateNeighboringStateDto.neighboring_state_id)
    if (!foundNeighboringState) {
      throw new HttpException(AppError.NEIGHBORING_STATE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.neighboringStateService.update(updateNeighboringStateDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.NeighboringStateDelete)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.NEIGHBORING_STATE_DELETE_RESPONSE,
    type: StatusNeighboringStateResponse,
  })
  @ApiOperation({ summary: AppStrings.NEIGHBORING_STATE_DELETE_OPERATION })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    const foundNeighboringState = await this.neighboringStateService.findOne(+id)
    if (!foundNeighboringState) {
      throw new HttpException(AppError.NEIGHBORING_STATE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.neighboringStateService.remove(+id, request.user.user_id)
  }
}
