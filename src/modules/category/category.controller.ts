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
import { ArrayCategoryResponse, StatusCategoryResponse } from './response'
import { CategoryFilter } from './filters'

@ApiTags('Category (Task)')
@Controller('category')
@UseFilters(AllExceptionsFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @HasPermissions(PermissionEnum.CategoryCreate)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiCreatedResponse({
    description: 'Категория успешно создана',
    type: StatusCategoryResponse,
  })
  @ApiOperation({ summary: 'Создание категории' })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() request) {
    return this.categoryService.create(createCategoryDto, request.user.user_id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Список категорий',
    type: ArrayCategoryResponse,
  })
  @ApiOperation({ summary: 'Список всех категорий' })
  @ApiBody({ required: false, type: CategoryFilter })
  @Post('all')
  async findAll(@Body() categoryFilter?: CategoryFilter) {
    return this.categoryService.findAll(categoryFilter)
  }

  @ApiBearerAuth()
  @HasPermissions(PermissionEnum.CategoryUpdate)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOkResponse({
    description: 'Категория успешно изменена',
    type: Category,
  })
  @ApiOperation({ summary: 'Изменение категории' })
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
    description: 'Категория успешно удалена',
    type: StatusCategoryResponse,
  })
  @ApiOperation({ summary: 'Удаление категории' })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundCategory = await this.categoryService.findOne(id)
    if (foundCategory == null) {
      throw new HttpException(AppError.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.categoryService.remove(+id, request.user.user_id)
  }
}
