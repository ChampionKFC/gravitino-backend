import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, HttpException, HttpStatus, UseFilters } from '@nestjs/common'
import { PropertyNamesService } from './property_names.service'
import { CreatePropertyDto } from './dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { ArrayPropertyNameResponse, StatusPropertyNameResponse } from './response'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'

@ApiBearerAuth()
@ApiTags('Properties')
@Controller('property')
@UseFilters(AllExceptionsFilter)
export class PropertyNamesController {
  constructor(private readonly propertyNamesService: PropertyNamesService) {}

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @ApiOperation({ summary: AppStrings.PROPERTY_CREATE_OPERATION })
  @ApiCreatedResponse({
    description: AppStrings.PROPERTY_CREATED_RESPONSE,
    type: StatusPropertyNameResponse,
  })
  @Post()
  create(@Body() createPropertiesDto: CreatePropertyDto, @Req() request) {
    return this.propertyNamesService.bulkCreate(createPropertiesDto, request.user.user_id)
  }

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @ApiOperation({ summary: AppStrings.PROPERTY_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.PROPERTY_ALL_RESPONSE,
    type: ArrayPropertyNameResponse,
  })
  @Get('all/:entity')
  findAll(@Param('entity') entity: string) {
    return this.propertyNamesService.findAll(entity)
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: AppStrings.PROPERTY_UPDATE_OPERATION })
  // @ApiOkResponse({
  //   description: AppStrings.PROPERTY_UPDATE_RESPONSE,
  //   type: PropertyName,
  // })
  // @Patch()
  // async update(@Body() updatePropertyDto: UpdatePropertyDto, @Req() request) {
  //   let foundPropertyName = null
  //   if (updatePropertyDto.property_name_id) {
  //     foundPropertyName = await this.propertyNamesService.findOne(updatePropertyDto.property_name_id)
  //   }
  //   if (!foundPropertyName) {
  //     throw new HttpException(AppError.PROPERTY_NOT_FOUND, HttpStatus.NOT_FOUND)
  //   }

  //   return this.propertyNamesService.update(updatePropertyDto, request.user.user_id)
  // }

  @UseGuards(JwtAuthGuard, ActiveGuard)
  @ApiOperation({ summary: AppStrings.PROPERTY_DELETE_OPERATION })
  @ApiOkResponse({
    description: AppStrings.PROPERTY_DELETE_RESPONSE,
    type: StatusPropertyNameResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundPropertyName = await this.propertyNamesService.findOne(id)
    if (!foundPropertyName) {
      throw new HttpException(AppError.PROPERTY_NAME_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.propertyNamesService.remove(+id, request.user.user_id)
  }
}
