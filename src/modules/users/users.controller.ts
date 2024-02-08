import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseFilters, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { CreateUserDto, CreateUserOrganizationDto, UpdateUserDto, UpdateUserOrganizationDto, UpdateUserStatusDto } from './dto'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { RolesService } from '../roles/roles.service'
import { OrganizationService } from '../organization/organization.service'
import { GroupService } from '../group/group.service'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { UserFilter } from './filters'
import { ArrayUserResponse, StatusUserResponse } from './response'
import { OrganizationTypeService } from '../organization_type/organization_type.service'
import { AppStrings } from 'src/common/constants/strings'

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roleService: RolesService,
    private readonly organizationService: OrganizationService,
    private readonly organizationTypeService: OrganizationTypeService,
    private readonly groupService: GroupService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Patch('organization')
  async updateOrganization(@Body() organization: UpdateUserOrganizationDto, @Req() request) {
    const foundUser = await this.usersService.findByEmail(organization.email)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: AppStrings.USER_DELETE_OPERATION })
  @ApiResponse({
    status: 200,
    description: AppStrings.USER_DELETE_RESPONSE,
    type: User,
  })
  async remove(@Param('id') id: number, @Req() request) {
    const foundUser = await this.usersService.findOne(id)
    if (foundUser == null) {
      throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.usersService.remove(+id, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change_status')
  @ApiOperation({ summary: AppStrings.USER_DELETE_OPERATION })
  @ApiOkResponse({ type: StatusUserResponse, description: AppStrings.USER_DELETE_RESPONSE })
  async approve(@Body() updateUserStatusDto: UpdateUserStatusDto, @Req() request) {
    const foundUser = await this.usersService.findOne(updateUserStatusDto.user_id)
    if (!foundUser) {
      throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.usersService.changeStatus(updateUserStatusDto, request.user.user_id)
  }
}
