import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Get } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto, UpdateRoleDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { Role } from './entities/role.entity'
import { ArrayRoleResponse, StatusRoleResponse } from './response'
import { RoleFilter } from './filters'

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@UseFilters(AllExceptionsFilter)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание роли' })
  @ApiCreatedResponse({
    description: 'Роль успешно создана',
    type: StatusRoleResponse,
  })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Req() request) {
    return this.rolesService.create(createRoleDto, request.user.user_id)
  }

  @ApiOperation({ summary: 'Список всех ролей' })
  @ApiOkResponse({
    description: 'Список ролей',
    type: ArrayRoleResponse,
  })
  @ApiBody({ required: false, type: RoleFilter })
  @Post('all')
  async findAll(@Body() roleFilter: RoleFilter) {
    return this.rolesService.findAll(roleFilter)
  }

  @ApiOperation({ summary: 'Список всех ролей' })
  @ApiOkResponse({
    description: 'Список ролей',
    type: ArrayRoleResponse,
  })
  @Get('all')
  async getAll() {
    return this.rolesService.findAll({})
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Изменение роли' })
  @ApiOkResponse({
    description: 'Роль успешно изменена',
    type: Role,
  })
  @ApiResponse({ status: 404, description: 'Роль не существует!' })
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
  @ApiOperation({ summary: 'Удаление роли' })
  @ApiOkResponse({
    description: 'Роль успешно удалена',
    type: StatusRoleResponse,
  })
  @ApiResponse({ status: 404, description: 'Роль не существует!' })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundRole = await this.rolesService.findOne(id)

    if (!foundRole) {
      throw new HttpException(AppError.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.rolesService.remove(+id, request.user.user_id)
  }
}
