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
} from '@nestjs/common'
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
import { FacilityTypeService } from '../facility_type/facility_type.service'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('Facility')
@Controller('facility')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class FacilityController {
  constructor(
    private readonly facilityService: FacilityService,
    private readonly facilityTypeService: FacilityTypeService,
    private readonly branchService: BranchService,
    private readonly checkpointService: CheckpointService,
    private readonly organizationService: OrganizationService,
  ) {}

  @HasPermissions(PermissionEnum.FacilityCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
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

    for (const organization of createFacilityDto.organization_ids) {
      const foundOrganization = await this.organizationService.findOne(organization)
      if (!foundOrganization) {
        throw new HttpException(`${AppError.ORGANIZATION_NOT_FOUND} (ID: ${organization})`, HttpStatus.NOT_FOUND)
      }
    }

    return this.facilityService.create(createFacilityDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.FacilityGet)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
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

  @HasPermissions(PermissionEnum.FacilityGet)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
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

    return this.facilityService.findAllByBranch(branch_ids, [], facilityFilter) //todo
  }

  @HasPermissions(PermissionEnum.FacilityGet)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
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

    return this.facilityService.findAllByCheckpoint(checkpoint_ids, [], facilityFilter) //todo
  }

  // @HasPermissions(PermissionEnum.FacilityGet)
  @UseGuards(JwtAuthGuard, ActiveGuard)
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
  @Post('all-by-type')
  async findAllByType(@Query('type_ids') type_ids: number[], @Body() facilityFilter?: FacilityFilter) {
    for (let index = 0; index < type_ids.length; index++) {
      const element = type_ids[index]

      const foundType = await this.facilityTypeService.findOne(+element)
      if (!foundType) {
        throw new HttpException(`${AppError.FACILITY_TYPE_NOT_FOUND} (ID: ${element})`, HttpStatus.NOT_FOUND)
      }
    }

    return this.facilityService.findAllByType(type_ids, facilityFilter)
  }

  @HasPermissions(PermissionEnum.FacilityUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
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

    if (updateFacilityDto.organization_ids) {
      for (const organization of updateFacilityDto.organization_ids) {
        const foundOrganization = await this.organizationService.findOne(organization)
        if (!foundOrganization) {
          throw new HttpException(`${AppError.ORGANIZATION_NOT_FOUND} (ID: ${organization})`, HttpStatus.NOT_FOUND)
        }
      }
    }

    return this.facilityService.update(updateFacilityDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.FacilityDelete)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
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

  @HasPermissions(PermissionEnum.FacilityCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.FACILITY_IMPORT_RESPONSE,
    type: StatusFacilityResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_IMPORT_OPERATION })
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
    return this.facilityService.import(file, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.CheckpointCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.FACILITY_IMPORT_UPLOAD_RESPONSE,
    type: StatusFacilityResponse,
  })
  @ApiOperation({ summary: AppStrings.FACILITY_IMPORT_UPLOAD_OPERATION })
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
    return this.facilityService.previewImport(file)
  }
}
