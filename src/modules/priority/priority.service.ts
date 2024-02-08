import { Injectable } from '@nestjs/common'
import { CreatePriorityDto, UpdatePriorityDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { OrderPriority } from './entities/priority.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { OrderPriorityResponse, StatusOrderPriorityResponse } from './response'
import { OrderPriorityFilter } from './filters'
import { Sequelize } from 'sequelize-typescript'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { QueryTypes } from 'sequelize'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class PriorityService {
  constructor(
    @InjectModel(OrderPriority)
    private orderPriorityRepository: typeof OrderPriority,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createPriorityDto: CreatePriorityDto, user_id: number): Promise<StatusOrderPriorityResponse> {
    try {
      const newPriority = await this.orderPriorityRepository.create({
        ...createPriorityDto,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_PRIORITY_CREATED}${newPriority.priority_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newPriority }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(orderPriorityFilter: OrderPriorityFilter): Promise<ArrayOrderPriorityResponse> {
    try {
      const offset_count = orderPriorityFilter.offset?.count == undefined ? 50 : orderPriorityFilter.offset.count
      const offset_page = orderPriorityFilter.offset?.page == undefined ? 1 : orderPriorityFilter.offset.page

      let whereQuery = ''
      if (orderPriorityFilter?.filter) {
        whereQuery = generateWhereQuery(orderPriorityFilter?.filter)
      }
      let sortQuery = ''
      if (orderPriorityFilter?.sorts) {
        sortQuery = generateSortQuery(orderPriorityFilter?.sorts)
      }

      const foundPriorities = await this.sequelize.query<OrderPriority>(
        `
          SELECT
            "priority_id",
            "priority_name",
            "createdAt",
            "updatedAt"
          FROM
            "OrderPriorities" AS "OrderPriority"
          ${whereQuery}
          ${sortQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: foundPriorities.length, data: foundPriorities }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(id: number): Promise<boolean> {
    try {
      const result = await this.orderPriorityRepository.findOne({
        where: { priority_id: id },
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

  async update(updatePriorityDto: UpdatePriorityDto, user_id: number): Promise<OrderPriorityResponse> {
    try {
      let foundPriority = null
      await this.orderPriorityRepository.update({ ...updatePriorityDto }, { where: { priority_id: updatePriorityDto.priority_id } })

      foundPriority = await this.orderPriorityRepository.findOne({
        where: { priority_id: updatePriorityDto.priority_id },
      })

      if (foundPriority) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_PRIORITY_UPDATED}${foundPriority.priority_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundPriority
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(priority_id: number, user_id: number): Promise<StatusOrderPriorityResponse> {
    try {
      const deletePriority = await this.orderPriorityRepository.destroy({
        where: { priority_id },
      })

      if (deletePriority) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_PRIORITY_DELETED}${priority_id}`,
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
