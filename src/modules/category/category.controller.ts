import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseFilters } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { HasPermissions } from '../auth/guards/permissions.decorator'
import { PermissionEnum } from '../auth/guards/enums/permission.enum'
import { PermissionsGuard } from '../auth/guards/permission.guard'
import { AppError } from 'src/common/constants/error'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { Category } from './entities/category.entity'
import { StatusCategoryResponse } from './response'
import { CategoryFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'

@ApiTags('Category (Task)')
@Controller('category')
@UseFilters(AllExceptionsFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @HasPermissions(PermissionEnum.CategoryCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiCreatedResponse({
    description: AppStrings.CATEGORY_CREATED_RESPONSE,
    type: StatusCategoryResponse,
  })
  @ApiOperation({ summary: AppStrings.CATEGORY_CREATE_OPERATION })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() request) {
    return this.categoryService.create(createCategoryDto, request.user.user_id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: AppStrings.CATEGORY_ALL_RESPONSE,
    type: Category,
    isArray: true,
  })
  @ApiOperation({ summary: AppStrings.CATEGORY_ALL_OPERATION })
  @ApiBody({ required: false, type: CategoryFilter })
  @Post('all')
  async findAll(@Body() categoryFilter?: CategoryFilter) {
    return this.categoryService.findAll(categoryFilter)
  }

  @ApiBearerAuth()
  @HasPermissions(PermissionEnum.CategoryUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOkResponse({
    description: AppStrings.CATEGORY_UPDATE_RESPONSE,
    type: Category,
  })
  @ApiOperation({ summary: AppStrings.CATEGORY_UPDATE_OPERATION })
  @Patch()
  async update(@Body() updateCategoryDto: UpdateCategoryDto, @Req() request) {
    let foundCategory = null
    if (updateCategoryDto.category_id) {
      foundCategory = await this.categoryService.findOne(updateCategoryDto.category_id)
    }
    if (!foundCategory) {
      throw new HttpException(AppError.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.categoryService.update(updateCategoryDto, request.user.user_id)
  }

  @ApiBearerAuth()
  @HasPermissions(PermissionEnum.CategoryDelete)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOkResponse({
    description: AppStrings.CATEGORY_DELETE_RESPONSE,
    type: StatusCategoryResponse,
  })
  @ApiOperation({ summary: AppStrings.CATEGORY_DELETE_OPERATION })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundCategory = await this.categoryService.findOne(id)
    if (foundCategory == null) {
      throw new HttpException(AppError.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.categoryService.remove(+id, request.user.user_id)
  }
}
