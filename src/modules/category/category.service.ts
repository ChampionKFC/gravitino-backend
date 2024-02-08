import { Injectable } from '@nestjs/common'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Category } from './entities/category.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayCategoryResponse, CategoryResponse, StatusCategoryResponse } from './response'
import { CategoryFilter } from './filters'
import { QueryTypes } from 'sequelize'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(category: CreateCategoryDto, user_id: number): Promise<StatusCategoryResponse> {
    try {
      const newCategory = await this.categoryRepository.create({ ...category })

      const historyDto = {
        user_id: user_id,
        comment: `Создана категория #${newCategory.category_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newCategory }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(categoryFilter?: CategoryFilter): Promise<ArrayCategoryResponse> {
    try {
      const offset_count = categoryFilter.offset?.count == undefined ? 50 : categoryFilter.offset.count
      const offset_page = categoryFilter.offset?.page == undefined ? 1 : categoryFilter.offset.page

      let whereQuery = ''
      if (categoryFilter?.filter) {
        whereQuery = generateWhereQuery(categoryFilter?.filter)
      }
      let sortQuery = ''
      if (categoryFilter?.sorts) {
        sortQuery = generateSortQuery(categoryFilter?.sorts)
      }

      const foundCategories = await this.sequelize.query<Category>(
        `
          SELECT
            "category_id",
            "category_name",
            "createdAt",
            "updatedAt"
          FROM
            "Categories" AS "Category"
          ${whereQuery}
          ${sortQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: foundCategories.length, data: foundCategories }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(category_id: number): Promise<boolean> {
    try {
      const result = await this.categoryRepository.findOne({
        where: { category_id },
      })

      if (result) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatedCategory: UpdateCategoryDto, user_id: number): Promise<CategoryResponse> {
    try {
      let foundCategory = null
      await this.categoryRepository.update({ ...updatedCategory }, { where: { category_id: updatedCategory.category_id } })

      foundCategory = await this.categoryRepository.findOne({
        where: { category_id: updatedCategory.category_id },
      })

      if (foundCategory) {
        const historyDto = {
          user_id: user_id,
          comment: `Изменена категория #${foundCategory.category_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundCategory
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(category_id: number, user_id: number): Promise<StatusCategoryResponse> {
    try {
      const deleteCategory = await this.categoryRepository.destroy({
        where: { category_id },
      })

      if (deleteCategory) {
        const historyDto = {
          user_id: user_id,
          comment: `Удалена категория #${category_id}`,
        }
        await this.historyService.create(historyDto)

        return { status: true }
      }

      return { status: false }
    } catch (error) {
      throw new Error(error)
    }
  }
}
