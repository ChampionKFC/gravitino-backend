import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { PropertyNamesService } from './property_names.service';
import { CreatePropertyNameDto, UpdatePropertyNameDto } from './dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { AppError } from 'src/common/constants/error';
import { AllExceptionsFilter } from 'src/common/exception.filter';
import { PropertyName } from './entities/property_name.entity';
import { StatusPropertyNameResponse } from './response';

@ApiBearerAuth()
@ApiTags('Property names')
@Controller('property-names')
@UseFilters(AllExceptionsFilter)
export class PropertyNamesController {
  constructor(private readonly propertyNamesService: PropertyNamesService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание названия характеристики' })
  @ApiCreatedResponse({
    description: 'Название характеристики успешно создано',
    type: StatusPropertyNameResponse,
  })
  @Post()
  create(@Body() createPropertyNameDto: CreatePropertyNameDto, @Req() request) {
    return this.propertyNamesService.create(
      createPropertyNameDto,
      request.user.user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Список всех названий характеристик' })
  @ApiOkResponse({
    description: 'Список всех названий характеристик',
    type: PropertyName,
    isArray: true,
  })
  @Get('all')
  findAll() {
    return this.propertyNamesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Изменение названия характеристики' })
  @ApiOkResponse({
    description: 'Название характеристики успешно изменено',
    type: PropertyName,
  })
  @Patch()
  async update(
    @Body() updatePropertyNameDto: UpdatePropertyNameDto,
    @Req() request,
  ) {
    let foundPropertyName = null;
    if (updatePropertyNameDto.property_name_id) {
      foundPropertyName = await this.propertyNamesService.findOne(
        updatePropertyNameDto.property_name_id,
      );
    }
    if (!foundPropertyName) {
      throw new HttpException(
        AppError.PROPERTY_NAME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.propertyNamesService.update(
      updatePropertyNameDto,
      request.user.user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление названия характеристики' })
  @ApiOkResponse({
    description: 'Название характеристики успешно удалено',
    type: StatusPropertyNameResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundPropertyName = await this.propertyNamesService.findOne(id);
    if (!foundPropertyName) {
      throw new HttpException(
        AppError.PROPERTY_NAME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.propertyNamesService.remove(+id, request.user.user_id);
  }
}
