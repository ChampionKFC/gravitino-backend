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
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { AppError } from 'src/common/constants/error';
import { OrganizationService } from '../organization/organization.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/common/exception.filter';
import { Branch } from './entities/branch.entity';
import { StatusBranchResponse } from './response';
import { BranchFilter } from './filters';

@ApiBearerAuth()
@ApiTags('Branch')
@Controller('branch')
@UseFilters(AllExceptionsFilter)
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly organizationService: OrganizationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Филиал успешно создан',
    type: StatusBranchResponse,
  })
  @ApiOperation({ summary: 'Создание филиала' })
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto, @Req() request) {
    return this.branchService.create(createBranchDto, request.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Список филиалов',
    type: Branch,
    isArray: true,
  })
  @ApiOperation({ summary: 'Список всех филиалов' })
  @ApiBody({ required: false, type: BranchFilter })
  @Post('all')
  findAll(@Body() branchFilter?: BranchFilter) {
    return this.branchService.findAll(branchFilter);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Филиал успешно изменен',
    type: Branch,
  })
  @ApiOperation({ summary: 'Изменение филиала' })
  @Patch()
  async update(@Body() updateBranchDto: UpdateBranchDto, @Req() request) {
    let foundBranch = null;
    if (updateBranchDto.branch_id) {
      foundBranch = await this.branchService.findOne(updateBranchDto.branch_id);
    }
    if (!foundBranch) {
      throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.branchService.update(updateBranchDto, request.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Филиал успешно удален',
    type: StatusBranchResponse,
  })
  @ApiOperation({ summary: 'Удаление филиала' })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundBranch = await this.branchService.findOne(id);
    if (!foundBranch) {
      throw new HttpException(AppError.BRANCH_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.branchService.remove(+id, request.user.user_id);
  }
}
