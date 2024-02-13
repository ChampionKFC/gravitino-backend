import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Query } from '@nestjs/common'
import { FacilityService } from './facility.service'
import { CreateFacilityDto, UpdateFacilityDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { AppError } from 'src/common/constants/error'
import { Facility } from './entities/facility.entity'
import { ArrayFacilityResponse, StatusFacilityResponse } from './response'
import { FacilityFilter } from './filters'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { OrganizationService } from '../organization/organization.service'
import { BranchService } from '../branch/branch.service'
import { AppStrings } from 'src/common/constants/strings'

@ApiTags('Facility')
@Controller('facility')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class FacilityController {
  constructor(
    private readonly facilityService: FacilityService,
    private readonly branchService: BranchService,
    private readonly checkpointService: CheckpointService,
    private readonly organizationService: OrganizationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: AppStrings.FACILITY_CREATED_RESPONSE,
    type: StatusFacilityResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_CREATE_OPERATION })
  @Post()
  async create(@Body() createFacilityDto: CreateFacilityDto, @Req() request) {
    const foundCheckpoint = await this.checkpointService.findOne(createFacilityDto.checkpoint_id)
    if (!foundCheckpoint) {
      throw new HttpException(AppError.CHECKPOINT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const foundOrganization = await this.organizationService.findOne(createFacilityDto.organization_id)
    if (!foundOrganization) {
      throw new HttpException(AppError.ORGANIZATION_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.facilityService.create(createFacilityDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: AppStrings.FACILITY_ALL_RESPONSE,
    type: ArrayFacilityResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_ALL_OPERATION })
  @ApiBody({ required: false, type: FacilityFilter })
  @Post('all')
  async findAll(@Body() facilityFilter?: FacilityFilter) {
    return this.facilityService.findAll(facilityFilter)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.FACILITY_ALL_BY_BRANCH_RESPONSE,
    type: ArrayFacilityResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_ALL_BY_BRANCH_OPERATION })
  @ApiBody({ required: false, type: FacilityFilter })
  @Post('all-by-branch')
  async findAllByBranch(@Query('branch_ids') branch_ids: number[], @Body() facilityFilter?: FacilityFilter) {
    for (let index = 0; index < branch_ids.length; index++) {
      const element = branch_ids[index]

      const foundBranch = await this.branchService.findOne(+element)
      if (!foundBranch) {
        throw new HttpException(`${AppError.BRANCH_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
      }
    }

    return this.facilityService.findAllByBranch(branch_ids, facilityFilter)
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: AppStrings.FACILITY_ALL_BY_CHECKPOINT_RESPONSE,
    type: Facility,
    isArray: true,
  })
  @ApiOperation({
    summary: AppStrings.FACILITY_ALL_BY_CHECKPOINT_OPERATION,
  })
  @ApiBody({ required: false, type: FacilityFilter })
  @Post('all-by-checkpoint')
  async findAllByCheckpoint(@Query('checkpoint_ids') checkpoint_ids: number[], @Body() facilityFilter?: FacilityFilter) {
    for (let index = 0; index < checkpoint_ids.length; index++) {
      const element = checkpoint_ids[index]

      const foundCheckpoint = await this.checkpointService.findOne(+element)
      if (!foundCheckpoint) {
        throw new HttpException(`${AppError.CHECKPOINT_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
      }
    }

    return this.facilityService.findAllByCheckpoint(checkpoint_ids, facilityFilter)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: AppStrings.FACILITY_UPDATE_RESPONSE,
    type: Facility,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_UPDATE_OPERATION })
  @Patch()
  async update(@Body() updateFacilityDto: UpdateFacilityDto, @Req() request) {
    let foundFacility = null
    if (updateFacilityDto.facility_id) {
      foundFacility = await this.facilityService.findOne(updateFacilityDto.facility_id)
    }
    if (!foundFacility) {
      throw new HttpException(AppError.FACILITY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (updateFacilityDto.checkpoint_id) {
      const foundCheckpoint = await this.checkpointService.findOne(updateFacilityDto.checkpoint_id)
      if (!foundCheckpoint) {
        throw new HttpException(AppError.CHECKPOINT_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    if (updateFacilityDto.organization_id) {
      const foundOrganization = await this.organizationService.findOne(updateFacilityDto.organization_id)
      if (!foundOrganization) {
        throw new HttpException(AppError.ORGANIZATION_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.facilityService.update(updateFacilityDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: AppStrings.FACILITY_DELETE_RESPONSE,
    type: StatusFacilityResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_DELETE_OPERATION })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundFacility = await this.facilityService.findOne(id)
    if (!foundFacility) {
      throw new HttpException(AppError.FACILITY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.facilityService.remove(+id, request.user.user_id)
  }
}
