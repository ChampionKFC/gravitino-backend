import { Controller, Get, Body, Patch, Req, UseGuards, HttpException, HttpStatus, UseFilters } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { UpdatePermissionDto } from './dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
@UseFilters(AllExceptionsFilter)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // @UseGuards(JwtAuthGuard, ActiveGuard)
  // @Post()
  // async create(@Body() createPermissionDto: CreatePermissionDto, @Req() request) {
  //   return this.permissionsService.create(createPermissionDto, request.user.user_id)
  // }

  @Get('all')
  async findAll() {
    return this.permissionsService.findAll()
  }

  @HasPermissions(PermissionEnum.PermissionUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard, ActiveGuard)
  @Patch()
  async update(@Body() updatePermissionDto: UpdatePermissionDto, @Req() request) {
    let foundPermission = null
    if (updatePermissionDto.permission_id) {
      foundPermission = await this.permissionsService.findOne(updatePermissionDto.permission_id)
    }

    if (!foundPermission) {
      throw new HttpException(AppError.PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.permissionsService.update(updatePermissionDto, request.user.user_id)
  }

  // @UseGuards(JwtAuthGuard, ActiveGuard)
  // @Delete(':id')
  // async remove(@Param('id') id: number, @Req() request) {
  //   const foundPermission = await this.permissionsService.findOne(id)
  //   if (!foundPermission) {
  //     throw new HttpException(AppError.PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND)
  //   }

  //   return this.permissionsService.remove(id, request.user.user_id)
  // }
}
