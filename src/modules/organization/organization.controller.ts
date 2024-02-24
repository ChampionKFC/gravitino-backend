import { Controller, Post, Body, Param, UseFilters, Get } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { OrganizationTypeService } from '../organization_type/organization_type.service'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { OrganizationFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayOrganizationResponse } from './response'

@ApiBearerAuth()
@ApiTags('Organization')
@Controller('organization')
@UseFilters(AllExceptionsFilter)
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationTypeService: OrganizationTypeService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Создание организации' })
  // @ApiCreatedResponse({
  //   description: 'Организация успешно создана',
  //   type: StatusOrganizationResponse,
  // })
  // @Post()
  // async create(@Body() createOrganizationDto: CreateOrganizationDto, @Req() request) {
  //   if (createOrganizationDto.organization_type_id) {
  //     const foundOrganizationType = await this.organizationTypeService.findOne(createOrganizationDto.organization_type_id)
  //     if (!foundOrganizationType) {
  //       throw new HttpException(AppError.ORGANIZATION_TYPE_NOT_FOUND, HttpStatus.NOT_FOUND)
  //     }
  //   }

  //   return this.organizationService.create(createOrganizationDto, request.user.user_id)
  // }

  //@UseGuards(JwtAuthGuard)
  @Post('all')
  @ApiOperation({ summary: AppStrings.ORGANIZATION_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_ALL_RESPONSE,
    type: ArrayOrganizationResponse,
  })
  @ApiBody({ required: false, type: OrganizationFilter })
  findAll(@Body() organizationFilter: OrganizationFilter) {
    return this.organizationService.findAll(organizationFilter)
  }

  //@UseGuards(JwtAuthGuard)
  @Get('all/:checkpoint_id')
  @ApiOperation({ summary: AppStrings.ORGANIZATION_ALL_BY_CHECKPOINT_OPERATION })
  @ApiOkResponse({
    description: AppStrings.ORGANIZATION_ALL_BY_CHECKPOINT_RESPONSE,
    type: ArrayOrganizationResponse,
  })
  findAllByCheckpoint(@Param('checkpoint_id') checkpoint_id: number) {
    return this.organizationService.findAllByCheckpoint(checkpoint_id)
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch()
  // @ApiOperation({ summary: 'Изменение организации' })
  // @ApiOkResponse({
  //   description: 'Организация успешно изменена',
  //   type: Organization,
  // })
  // @ApiResponse({ status: 404, description: 'Организация не существует!' })
  // @ApiResponse({ status: 403, description: 'Forbidden!' })
  // async update(@Body() updateOrganizationDto: UpdateOrganizationDto, @Req() request) {
  //   let foundOrganization = null
  //   if (updateOrganizationDto.organization_id) {
  //     foundOrganization = await this.organizationService.findOne(updateOrganizationDto.organization_id)
  //   }
  //   if (!foundOrganization) {
  //     throw new HttpException(AppError.ORGANIZATION_NOT_FOUND, HttpStatus.NOT_FOUND)
  //   }

  //   if (updateOrganizationDto.organization_type_id) {
  //     const foundOrganizationType = await this.organizationTypeService.findOne(updateOrganizationDto.organization_type_id)
  //     if (!foundOrganizationType) {
  //       throw new HttpException(AppError.ORGANIZATION_TYPE_NOT_FOUND, HttpStatus.NOT_FOUND)
  //     }
  //   }

  //   return this.organizationService.update(updateOrganizationDto, request.user.user_id)
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // @ApiOperation({ summary: 'Удаление организации' })
  // @ApiOkResponse({
  //   description: 'Организация успешно удалена',
  //   type: StatusOrganizationResponse,
  // })
  // @ApiResponse({ status: 404, description: 'Организация не существует!' })
  // async remove(@Param('id') id: number, @Req() request) {
  //   const foundOrganization = await this.organizationService.findOne(id)
  //   if (foundOrganization == null) {
  //     throw new HttpException(AppError.ORGANIZATION_NOT_FOUND, HttpStatus.NOT_FOUND)
  //   }

  //   return this.organizationService.remove(+id, request.user.user_id)
  // }
}
