import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto, UpdateGroupDto } from './dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { BranchService } from '../branch/branch.service'
import { ArrayGroupResponse, StatusGroupResponse } from './response'

@ApiBearerAuth()
@ApiTags('Group')
@Controller('group')
@UseFilters(AllExceptionsFilter)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly branchService: BranchService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание группы' })
  @ApiCreatedResponse({
    description: 'Группа успешно создана',
    type: StatusGroupResponse,
  })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Req() request) {
    if (createGroupDto.branch_id) {
      const foundBranch = await this.branchService.findOne(createGroupDto.branch_id)
      if (!foundBranch) {
        throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.groupService.create(createGroupDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Список всех групп' })
  @ApiOkResponse({
    description: 'Список групп',
    type: ArrayGroupResponse,
  })
  @Get('all')
  findAll() {
    return this.groupService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Изменение группы' })
  @ApiOkResponse({
    description: 'Группа успешно изменена',
    type: StatusGroupResponse,
  })
  @Patch()
  async update(@Body() updateGroupDto: UpdateGroupDto, @Req() request) {
    let foundGroup = null
    if (updateGroupDto.group_id) {
      foundGroup = await this.groupService.findOne(updateGroupDto.group_id)
    }
    if (!foundGroup) {
      throw new HttpException(AppError.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (updateGroupDto.branch_id) {
      const foundBranch = await this.branchService.findOne(updateGroupDto.branch_id)
      if (!foundBranch) {
        throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    }

    return this.groupService.update(updateGroupDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление группы' })
  @ApiOkResponse({
    description: 'Группа успешно удалена',
    type: StatusGroupResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundGroup = await this.groupService.findOne(id)
    if (!foundGroup) {
      throw new HttpException(AppError.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.groupService.remove(+id, request.user.user_id)
  }
}
