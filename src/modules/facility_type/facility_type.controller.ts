import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common'
import { FacilityTypeService } from './facility_type.service'
import { CreateFacilityTypeDto, UpdateFacilityTypeDto } from './dto'
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { AppStrings } from 'src/common/constants/strings'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ArrayFacilityTypeResponse, StatusFacilityTypeResponse } from './response'
import { AppError } from 'src/common/constants/error'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'

@ApiTags('Facility Type')
@Controller('facility-type')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class FacilityTypeController {
  constructor(private readonly facilityTypeService: FacilityTypeService) {}

  @HasPermissions(PermissionEnum.FacilityTypeCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiCreatedResponse({
    description: AppStrings.FACILITY_TYPE_ALL_RESPONSE,
    type: StatusFacilityTypeResponse,
  })
  @ApiOperation({ summary: AppStrings.FILE_TYPE_ALL_OPERATION })
  @Post()
  create(@Body() createFacilityTypeDto: CreateFacilityTypeDto, @Req() request) {
    return this.facilityTypeService.create(createFacilityTypeDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.FACILITY_TYPE_ALL_RESPONSE,
    type: ArrayFacilityTypeResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_TYPE_ALL_OPERATION })
  @Get('all')
  findAll() {
    return this.facilityTypeService.findAll()
  }

  @HasPermissions(PermissionEnum.FacilityTypeUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.FACILITY_TYPE_UPDATE_RESPONSE,
    type: StatusFacilityTypeResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_TYPE_UPDATE_OPERATION })
  @Patch()
  async update(@Body() updateFacilityTypeDto: UpdateFacilityTypeDto, @Req() request) {
    const foundFacilityType = await this.facilityTypeService.findOne(updateFacilityTypeDto.facility_type_id)
    if (!foundFacilityType) {
      throw new HttpException(AppError.FACILITY_TYPE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    return this.facilityTypeService.update(updateFacilityTypeDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.FacilityTypeDelete)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.FACILITY_TYPE_DELETE_RESPONSE,
    type: StatusFacilityTypeResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_TYPE_DELETE_OPERATION })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    const foundFacilityType = await this.facilityTypeService.findOne(+id)
    if (!foundFacilityType) {
      throw new HttpException(AppError.FACILITY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.facilityTypeService.remove(+id, request.user.user_id)
  }
}
