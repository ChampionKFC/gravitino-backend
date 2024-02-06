import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  UseFilters,
  Get,
} from '@nestjs/common';
import { OrganizationTypeService } from './organization_type.service';
import { CreateOrganizationTypeDto, UpdateOrganizationTypeDto } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AppError } from 'src/common/constants/error';
import { AllExceptionsFilter } from 'src/common/exception.filter';
import { OrganizationType } from './entities/organization_type.entity';
import { StatusOrganizationTypeResponse } from './response';
import { OrganizationTypeFilter } from './filters';

@ApiBearerAuth()
@ApiTags('Organization Type')
@Controller('organization-type')
@UseFilters(AllExceptionsFilter)
export class OrganizationTypeController {
  constructor(
    private readonly organizationTypeService: OrganizationTypeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание вида деятельности организации' })
  @ApiCreatedResponse({
    description: 'Вид деятельности организации успешно создан',
    type: StatusOrganizationTypeResponse,
  })
  @Post()
  create(
    @Body() createOrganizationTypeDto: CreateOrganizationTypeDto,
    @Req() request,
  ) {
    return this.organizationTypeService.create(
      createOrganizationTypeDto,
      request.user.user_id,
    );
  }

  @Post('all')
  @ApiOperation({ summary: 'Список всех видов деятельности организаций' })
  @ApiOkResponse({
    description: 'Список видов деятельности организаций',
    type: OrganizationType,
    isArray: true,
  })
  @ApiBody({ required: false, type: OrganizationTypeFilter })
  findAll(@Body() organizationTypeFilter: OrganizationTypeFilter) {
    return this.organizationTypeService.findAll(organizationTypeFilter);
  }

  @Get('all')
  @ApiOperation({ summary: 'Список всех видов деятельности организаций' })
  @ApiOkResponse({
    description: 'Список видов деятельности организаций',
    type: OrganizationType,
    isArray: true,
  })
  getAll() {
    return this.organizationTypeService.findAll({});
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Изменение вида деятельности организации' })
  @ApiOkResponse({
    description: 'Вид деятельности организации успешно изменен',
    type: OrganizationType,
  })
  @Patch()
  async update(
    @Body() updateOrganizationTypeDto: UpdateOrganizationTypeDto,
    @Req() request,
  ) {
    let foundOrganizationType = null;
    if (updateOrganizationTypeDto.organization_type_id) {
      foundOrganizationType = await this.organizationTypeService.findOne(
        updateOrganizationTypeDto.organization_type_id,
      );
    }
    if (!foundOrganizationType) {
      throw new HttpException(
        AppError.ORGANIZATION_TYPE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.organizationTypeService.update(
      updateOrganizationTypeDto,
      request.user.user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление вида деятельности организации' })
  @ApiOkResponse({
    description: 'Вид деятельности организации успешно удален',
    type: StatusOrganizationTypeResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundOrganizationType =
      await this.organizationTypeService.findOne(id);
    if (!foundOrganizationType) {
      throw new HttpException(
        AppError.ORGANIZATION_TYPE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.organizationTypeService.remove(+id, request.user.user_id);
  }
}
