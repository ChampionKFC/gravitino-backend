import { Injectable } from '@nestjs/common'
import { CreateOrderStatusDto, UpdateOrderStatusDto } from './dto'
import { OrderStatus } from './entities/order_status.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayOrderStatusResponse, OrderStatusResponse, StatusOrderStatusResponse } from './response'
import { Sequelize } from 'sequelize-typescript'
import { OrderStatusFilter } from './filters'
import { QueryTypes } from 'sequelize'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { AppStrings } from 'src/common/constants/strings'
import { User } from '../users/entities/user.entity'

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectModel(OrderStatus) private orderStatusRepository: typeof OrderStatus,
    @InjectModel(User) private userRepository: typeof User,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(orderStatus: CreateOrderStatusDto, user_id: number): Promise<StatusOrderStatusResponse> {
    try {
      const newOrderStatus = await this.orderStatusRepository.create({
        ...orderStatus,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_ORDER_STATUS_CREATED}${newOrderStatus.order_status_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newOrderStatus }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(orderStatusFilter: OrderStatusFilter): Promise<ArrayOrderStatusResponse> {
    try {
      const offset_count = orderStatusFilter.offset?.count == undefined ? 50 : orderStatusFilter.offset.count
      const offset_page = orderStatusFilter.offset?.page == undefined ? 1 : orderStatusFilter.offset.page

      let whereQuery = ''
      if (orderStatusFilter?.filter) {
        whereQuery = generateWhereQuery(orderStatusFilter?.filter)
      }
      let sortQuery = ''
      if (orderStatusFilter?.sorts) {
        sortQuery = generateSortQuery(orderStatusFilter?.sorts)
      }

      const selectQuery = `
        SELECT
          "order_status_id",
          "order_status_name",
          "createdAt",
          "updatedAt"
        FROM
          "OrderStatuses" AS "OrderStatus"
        ${whereQuery}
        ${sortQuery}
      `

      const count = (
        await this.sequelize.query<OrderStatus>(selectQuery, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const foundStatuses = await this.sequelize.query<OrderStatus>(
        `
          ${selectQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: count, data: foundStatuses }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllByRole(user_id: string): Promise<ArrayOrderStatusResponse> {
    try {
      const user = await this.userRepository.findOne({ where: { user_id } })

      const availableStatuses = []
      if (user.role_id == 2) {
        availableStatuses.push(...[3, 4, 5])
      } else if (user.role_id == 3) {
        availableStatuses.push(...[1, 2, 3, 4, 5, 6, 7, 8])
      } else {
        availableStatuses.push(...[1, 2, 3, 4, 5, 6, 7, 8])
      }

      const foundStatuses = await this.orderStatusRepository.findAll({ where: { order_status_id: availableStatuses } })
      return { count: foundStatuses.length, data: foundStatuses }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(order_status_id: number): Promise<boolean> {
    try {
      const result = await this.orderStatusRepository.findOne({
        where: { order_status_id },
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

  async update(updatedOrderStatus: UpdateOrderStatusDto, user_id: number): Promise<OrderStatusResponse> {
    try {
      await this.orderStatusRepository.update({ ...updatedOrderStatus }, { where: { order_status_id: updatedOrderStatus.order_status_id } })

      const foundOrderStatus = await this.orderStatusRepository.findOne({
        where: { order_status_id: updatedOrderStatus.order_status_id },
      })

      if (foundOrderStatus) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ORDER_STATUS_UPDATED} #${foundOrderStatus.order_status_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundOrderStatus
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(order_status_id: number, user_id: number): Promise<StatusOrderStatusResponse> {
    try {
      const deleteOrderStatus = await this.orderStatusRepository.destroy({
        where: { order_status_id },
      })

      if (deleteOrderStatus) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ORDER_STATUS_DELETED}${order_status_id}`,
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
