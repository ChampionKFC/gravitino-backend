import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters, Get } from '@nestjs/common'
import { OrganizationTypeService } from './organization_type.service'
import { CreateOrganizationTypeDto, UpdateOrganizationTypeDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { OrganizationType } from './entities/organization_type.entity'
import { StatusOrganizationTypeResponse } from './response'
import { OrganizationTypeFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'

@ApiBearerAuth()
@ApiTags('Organization Type')
@Controller('organization-type')
@UseFilters(AllExceptionsFilter)
export class OrganizationTypeController {
  constructor(private readonly organizationTypeService: OrganizationTypeService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: AppStrings.ORGANIZATION_TYPE_CREATE_OPERATION })
  @ApiCreatedResponse({
    description: AppStrings.ORGANIZATION_TYPE_CREATED_RESPONSE,
    type: StatusOrganizationTypeResponse,
  })
  @Post()
  create(@Body() createOrganizationTypeDto: CreateOrganizationTypeDto, @Req() request) {
    return this.organizationTypeService.create(createOrganizationTypeDto, request.user.user_id)
  }

  @Post('all')
  @ApiOperation({ summary: AppStrings.ORGANIZATION_TYPE_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_TYPE_ALL_RESPONSE,
    type: ArrayOrganizationTypeResponse,
  })
  @ApiBody({ required: false, type: OrganizationTypeFilter })
  findAll(@Body() organizationTypeFilter: OrganizationTypeFilter) {
    return this.organizationTypeService.findAll(organizationTypeFilter)
  }

  @Get('all')
  @ApiOperation({ summary: AppStrings.ORGANIZATION_TYPE_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_TYPE_ALL_RESPONSE,
    type: ArrayOrganizationTypeResponse,
  })
  getAll() {
    return this.organizationTypeService.findAll({})
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: AppStrings.ORGANIZATION_TYPE_UPDATE_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_TYPE_UPDATE_RESPONSE,
    type: OrganizationType,
  })
  @Patch()
  async update(@Body() updateOrganizationTypeDto: UpdateOrganizationTypeDto, @Req() request) {
    let foundOrganizationType = null
    if (updateOrganizationTypeDto.organization_type_id) {
      foundOrganizationType = await this.organizationTypeService.findOne(updateOrganizationTypeDto.organization_type_id)
    }
    if (!foundOrganizationType) {
      throw new HttpException(AppError.ORGANIZATION_TYPE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.organizationTypeService.update(updateOrganizationTypeDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: AppStrings.ORGANIZATION_DELETE_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_DELETE_RESPONSE,
    type: StatusOrganizationTypeResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundOrganizationType = await this.organizationTypeService.findOne(id)
    if (!foundOrganizationType) {
      throw new HttpException(AppError.ORGANIZATION_TYPE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.organizationTypeService.remove(+id, request.user.user_id)
  }
}
