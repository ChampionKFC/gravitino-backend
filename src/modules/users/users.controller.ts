import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { CreateUserDto, CreateUserOrganizationDto, UpdateUserDto, UpdateUserOrganizationDto, UpdateUserStatusDto } from './dto'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { RolesService } from '../roles/roles.service'
import { GroupService } from '../group/group.service'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { UserFilter } from './filters'
import { ArrayUserResponse, StatusUserResponse } from './response'
import { OrganizationTypeService } from '../organization_type/organization_type.service'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roleService: RolesService,
    private readonly organizationTypeService: OrganizationTypeService,
    private readonly groupService: GroupService,
  ) {}

  @HasPermissions(PermissionEnum.UserCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOperation({ summary: AppStrings.USER_CREATE_OPERATION })
  @ApiCreatedResponse({
    description: AppStrings.USER_CREATED_RESPONSE,
    type: StatusUserResponse,
  })
  @Post()
  async create(@Body() user: CreateUserDto) {
    const foundUser = await this.usersService.findByEmail(user.email)
    if (foundUser) {
      throw new HttpException(AppError.USER_EMAIL_EXISTS, HttpStatus.CONFLICT)
    }

    const foundRole = await this.roleService.findOne(user.role_id)
    if (!foundRole) {
      throw new HttpException(AppError.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (user.group_id) {
      const foundGroup = await this.groupService.findOne(user.group_id)
      if (!foundGroup) {
        throw new HttpException(AppError.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.usersService.create(user).catch((error) => {
      const errorMessage = error.message

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST)
    })
  }

  @HasPermissions(PermissionEnum.OrganizationCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOperation({ summary: AppStrings.USER_ORGANIZATION_CREATE_OPERATION })
  @ApiCreatedResponse({
    description: AppStrings.USER_ORGANIZATION_CREATED_RESPONSE,
    type: StatusUserResponse,
  })
  @Post('organization')
  async createOrganization(@Body() organization: CreateUserOrganizationDto) {
    const foundUser = await this.usersService.findByEmail(organization.email)
    if (foundUser) {
      throw new HttpException(AppError.USER_EMAIL_EXISTS, HttpStatus.CONFLICT)
    }

    const foundRole = await this.roleService.findOne(organization.role_id)
    if (!foundRole) {
      throw new HttpException(AppError.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const organizationType = await this.organizationTypeService.findOne(organization.organization_type_id)
    if (!organizationType) {
      throw new HttpException(AppError.ORGANIZATION_TYPE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (organization.group_id) {
      const foundGroup = await this.groupService.findOne(organization.group_id)
      if (!foundGroup) {
        throw new HttpException(AppError.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.usersService.createOrganization(organization).catch((error) => {
      const errorMessage = error.message

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST)
    })
  }

  @HasPermissions(PermissionEnum.UserGet)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Post('all')
  @ApiOperation({ summary: AppStrings.USER_ALL_OPERATION })
  @ApiResponse({
    status: 200,
    description: AppStrings.USER_ALL_RESPONSE,
    type: ArrayUserResponse,
  })
  @ApiBody({ required: false, type: UserFilter })
  findAll(@Body() userFilter: UserFilter) {
    return this.usersService.findAll(userFilter)
  }

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Get(':id')
  @ApiOperation({ summary: AppStrings.USER_GET_OPERATION })
  @ApiResponse({
    status: 200,
    description: AppStrings.USER_GET_RESPONSE,
    type: User,
  })
  findById(@Param('id') id: number) {
    return this.usersService.findById(+id)
  }

  @ApiOperation({ summary: AppStrings.USER_UPDATE_OPERATION })
  @ApiResponse({ status: 200, description: AppStrings.USER_UPDATE_RESPONSE })
  @HasPermissions(PermissionEnum.UserUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Patch()
  async update(@Body() user: UpdateUserDto, @Req() request) {
    const foundUser = await this.usersService.findByEmail(user.email)
    if (!foundUser) {
      throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (user.role_id) {
      const foundRole = await this.roleService.findOne(user.role_id)
      if (!foundRole) {
        throw new HttpException(AppError.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    if (user.group_id) {
      const foundGroup = await this.groupService.findOne(user.group_id)
      if (!foundGroup) {
        throw new HttpException(AppError.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.usersService.update(user, request.user.user_id)
  }

  @ApiOperation({ summary: AppStrings.USER_ORGANIZATION_UPDATE_OPERATION })
  @ApiResponse({ status: 200, description: AppStrings.USER_ORGANIZATION_UPDATE_RESPONSE })
  @HasPermissions(PermissionEnum.OrganizationUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Patch('organization')
  async updateOrganization(@Body() organization: UpdateUserOrganizationDto, @Req() request) {
    const foundUser = await this.usersService.findById(organization.user_id)
    if (!foundUser) {
      throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (organization.organization_type_id) {
      const foundOrganizationType = await this.organizationTypeService.findOne(organization.organization_type_id)
      if (!foundOrganizationType) {
        throw new HttpException(AppError.ORGANIZATION_TYPE_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    if (organization.role_id) {
      const foundRole = await this.roleService.findOne(organization.role_id)
      if (!foundRole) {
        throw new HttpException(AppError.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    if (organization.group_id) {
      const foundGroup = await this.groupService.findOne(organization.group_id)
      if (!foundGroup) {
        throw new HttpException(AppError.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.usersService.updateOrganization(organization, request.user.user_id)
  }

  // @HasPermissions(PermissionEnum.UserDelete)
  // @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  // @Delete(':id')
  // @ApiOperation({ summary: AppStrings.USER_DELETE_OPERATION })
  // @ApiResponse({
  //   status: 200,
  //   description: AppStrings.USER_DELETE_RESPONSE,
  //   type: User,
  // })
  // async remove(@Param('id') id: number, @Req() request) {
  //   const foundUser = await this.usersService.findOne(id)
  //   if (foundUser == null) {
  //     throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
  //   }

  //   return this.usersService.remove(+id, request.user.user_id)
  // }

  @HasPermissions(PermissionEnum.UserStatusUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Patch('change_status')
  @ApiOperation({ summary: AppStrings.USER_STATUS_UPDATE_OPERATION })
  @ApiOkResponse({ type: StatusUserResponse, description: AppStrings.USER_STATUS_UPDATE_RESPONSE })
  async changeStatus(@Body() updateUserStatusDto: UpdateUserStatusDto, @Req() request) {
    if (updateUserStatusDto.user_id == request.user.user_id) {
      throw new HttpException(AppError.USER_SELF_DEACTIVATE, HttpStatus.FORBIDDEN)
    } else {
      const foundUser = await this.usersService.findOne(updateUserStatusDto.user_id)
      if (!foundUser) {
        throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.usersService.changeStatus(updateUserStatusDto, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.UserCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_IMPORT_RESPONSE,
    type: StatusUserResponse,
  })
  @ApiOperation({ summary: AppStrings.ORGANIZATION_IMPORT_OPERATION })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!Boolean(file.mimetype.match(/(xls|xlsx|csv)/))) callback(null, false)
        callback(null, true)
      },
    }),
  )
  @Post('organization/import')
  async importOrganization(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request,
  ) {
    return this.usersService.importOrganization(file, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.UserCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_IMPORT_UPLOAD_RESPONSE,
    type: StatusUserResponse,
  })
  @ApiOperation({ summary: AppStrings.ORGANIZATION_IMPORT_UPLOAD_OPERATION })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!Boolean(file.mimetype.match(/(xls|xlsx|csv)/))) callback(null, false)
        callback(null, true)
      },
    }),
  )
  @Post('organization/upload-import')
  async uploadImportOrganization(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.usersService.previewImportOrganization(file)
  }

  @HasPermissions(PermissionEnum.UserCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.USER_IMPORT_RESPONSE,
    type: StatusUserResponse,
  })
  @ApiOperation({ summary: AppStrings.USER_IMPORT_OPERATION })
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
    return this.usersService.import(file, request.user.user_id)
  }

  @HasPermissions(PermissionEnum.UserCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @ApiOkResponse({
    description: AppStrings.USER_IMPORT_UPLOAD_RESPONSE,
    type: StatusUserResponse,
  })
  @ApiOperation({ summary: AppStrings.USER_IMPORT_UPLOAD_OPERATION })
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
    return this.usersService.previewImport(file)
  }
}
