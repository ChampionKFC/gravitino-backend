import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  UseFilters,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { BranchService } from './branch.service'
import { CreateBranchDto, UpdateBranchDto } from './dto'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { Branch } from './entities/branch.entity'
import { ArrayBranchResponse, StatusBranchResponse } from './response'
import { BranchFilter } from './filters'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'

@ApiBearerAuth()
@ApiTags('Branch')
@Controller('branch')
@UseFilters(AllExceptionsFilter)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @HasPermissions(PermissionEnum.BranchCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiCreatedResponse({
    description: AppStrings.BRANCH_CREATED_RESPONSE,
    type: StatusBranchResponse,
  })
  @ApiOperation({ summary: AppStrings.BRANCH_CREATE_OPERATION })
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto, @Req() request) {
    return this.branchService.create(createBranchDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.BranchGet)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.BRANCH_ALL_RESPONSE,
    type: ArrayBranchResponse,
  })
  @ApiOperation({ summary: AppStrings.BRANCH_ALL_OPERATION })
  @ApiBody({ required: false, type: BranchFilter })
  @Post('all')
  findAll(@Body() branchFilter?: BranchFilter) {
    return this.branchService.findAll(branchFilter)
  }

  @HasPermissions(PermissionEnum.BranchUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.BRANCH_UPDATE_RESPONSE,
    type: Branch,
  })
  @ApiOperation({ summary: AppStrings.BRANCH_UPDATE_OPERATION })
  @Patch()
  async update(@Body() updateBranchDto: UpdateBranchDto, @Req() request) {
    let foundBranch = null
    if (updateBranchDto.branch_id) {
      foundBranch = await this.branchService.findOne(updateBranchDto.branch_id)
    }
    if (!foundBranch) {
      throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.branchService.update(updateBranchDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.BranchDelete)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.BRANCH_DELETE_RESPONSE,
    type: StatusBranchResponse,
  })
  @ApiOperation({ summary: AppStrings.BRANCH_DELETE_OPERATION })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundBranch = await this.branchService.findOne(id)
    if (!foundBranch) {
      throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.branchService.remove(+id, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.BranchCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.BRANCH_IMPORT_RESPONSE,
    type: StatusBranchResponse,
  })
  @ApiOperation({ summary: AppStrings.BRANCH_IMPORT_OPERATION })
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
    return this.branchService.import(file, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.BranchCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.BRANCH_IMPORT_UPLOAD_RESPONSE,
    type: StatusBranchResponse,
  })
  @ApiOperation({ summary: AppStrings.BRANCH_IMPORT_UPLOAD_OPERATION })
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
    return this.branchService.previewImport(file)
  }
}
