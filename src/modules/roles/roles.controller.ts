import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Get } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto, UpdateRoleDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { Role } from './entities/role.entity'
import { StatusRoleResponse } from './response'
import { RoleFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@UseFilters(AllExceptionsFilter)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: AppStrings.ROLE_CREATE_OPERATION })
  @ApiCreatedResponse({
    description: AppStrings.ROLE_CREATED_RESPONSE,
    type: StatusRoleResponse,
  })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Req() request) {
    return this.rolesService.create(createRoleDto, request.user.user_id)
  }

  @ApiOperation({ summary: AppStrings.ROLE_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ROLE_ALL_RESPONSE,
    type: Role,
    isArray: true,
  })
  @ApiBody({ required: false, type: RoleFilter })
  @Post('all')
  async findAll(@Body() roleFilter: RoleFilter) {
    return this.rolesService.findAll(roleFilter)
  }

  @ApiOperation({ summary: AppStrings.ROLE_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ROLE_ALL_RESPONSE,
    type: Role,
    isArray: true,
  })
  @Get('all')
  async getAll() {
    return this.rolesService.findAll({})
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: AppStrings.ROLE_UPDATE_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ROLE_UPDATE_RESPONSE,
    type: Role,
  })
  @Patch()
  async update(@Body() updateRoleDto: UpdateRoleDto, @Req() request) {
    let foundRole = null
    if (updateRoleDto.role_id) {
      foundRole = await this.rolesService.findOne(updateRoleDto.role_id)
    }

    if (!foundRole) {
      throw new HttpException(AppError.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.rolesService.update(updateRoleDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: AppStrings.ROLE_DELETE_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ROLE_DELETE_RESPONSE,
    type: StatusRoleResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundRole = await this.rolesService.findOne(id)

    if (!foundRole) {
      throw new HttpException(AppError.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.rolesService.remove(+id, request.user.user_id)
  }
}
