import { Injectable } from '@nestjs/common'
import { CreateOrderJournalDto, UpdateOrderJournalDto } from './dto'
import { OrderJournal } from './entities/order_journal.entity'
import { InjectModel } from '@nestjs/sequelize'
import { ArrayOrderJournalResponse, StatusOrderJournalResponse } from './response'
import { QueryTypes, Transaction } from 'sequelize'
import { OrderJournalFilter } from './filters'
import { Sequelize } from 'sequelize-typescript'
import { generateSortQuery, generateWhereQuery } from 'src/common/utlis/generate_sort_query'

@Injectable()
export class OrderJournalService {
  constructor(
    @InjectModel(OrderJournal)
    private orderJournalRepository: typeof OrderJournal,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createOrderJournalDto: CreateOrderJournalDto, transaction?: Transaction): Promise<StatusOrderJournalResponse> {
    try {
      const newOrderJournal = await this.orderJournalRepository.create(
        {
          ...createOrderJournalDto,
        },
        { transaction },
      )
      return { status: true, data: newOrderJournal }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(orderJournalFilter: OrderJournalFilter): Promise<ArrayOrderJournalResponse> {
    try {
      const order_offset_count = orderJournalFilter.offset?.count == undefined ? 50 : orderJournalFilter.offset.count
      const order_offset_page = orderJournalFilter.offset?.page == undefined ? 1 : orderJournalFilter.offset.page

      let whereQuery = ''
      if (orderJournalFilter?.filter) {
        whereQuery = generateWhereQuery(orderJournalFilter?.filter)
      }

      let sortQuery = ''
      if (orderJournalFilter?.sorts) {
        sortQuery = generateSortQuery(orderJournalFilter?.sorts)
      }

      const orderJournalCount = await this.orderJournalRepository.count({ where: { order_id: orderJournalFilter.filter.order_id } })
      const selectQuery = `
        SELECT
          "OrderJournal"."order_journal_id",
          "OrderJournal"."order_id",
          "OrderJournal"."comment",
          "OrderJournal"."changed_field",
          "OrderJournal"."old_value",
          "OrderJournal"."new_value",
          "OrderJournal"."createdAt",
          "OrderJournal"."updatedAt",
          "user"."user_id" AS "user.user_id",
          "user"."group_id" AS "user.group_id",
          "user"."is_active" AS "user.is_active",
          "user"."email" AS "user.email",
          "user"."password" AS "user.password",
          "user->person"."person_id" AS "user.person.person_id",
          "user->person"."last_name" AS "user.person.last_name",
          "user->person"."first_name" AS "user.person.first_name",
          "user->person"."patronymic" AS "user.person.patronymic",
          "user->person"."phone" AS "user.person.phone",
          "user->person"."property_values" AS "user.person.property_values",
          "user->role"."role_id" AS "user.role.role_id",
          "user->role"."role_name" AS "user.role.role_name",
          "user->organization"."organization_id" AS "user.organization.organization_id",
          "user->organization"."organization_type_id" AS "user.organization.organization_type_id",
          "user->organization"."full_name" AS "user.organization.full_name",
          "user->organization"."short_name" AS "user.organization.short_name",
          "user->organization"."phone" AS "user.organization.phone",
          "user->organization"."property_values" AS "user.organization.property_values",
          "order_status"."order_status_id" AS "order_status.order_status_id",
          "order_status"."order_status_name" AS "order_status.order_status_name"
        FROM
          "OrderJournals" AS "OrderJournal"
          LEFT OUTER JOIN "Users" AS "user" ON "OrderJournal"."user_id" = "user"."user_id"
          LEFT OUTER JOIN "People" AS "user->person" ON "user"."person_id" = "user->person"."person_id"
          LEFT OUTER JOIN "Roles" AS "user->role" ON "user"."role_id" = "user->role"."role_id"
          LEFT OUTER JOIN "Organizations" AS "user->organization" ON "user"."organization_id" = "user->organization"."organization_id"
          LEFT OUTER JOIN "OrderStatuses" AS "order_status" ON "OrderJournal"."order_status_id" = "order_status"."order_status_id"
      `
      const result = await this.sequelize.query<OrderJournal>(
        `
          ${selectQuery}
          ${whereQuery}
          ${sortQuery}
          LIMIT ${order_offset_count} OFFSET ${(order_offset_page - 1) * order_offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )
      // const result = await this.orderJournalRepository.findAll({
      //   include: [
      //     {
      //       model: User,
      //       include: [
      //         {
      //           model: Person,
      //           attributes: { exclude: ['createdAt', 'updatedAt'] },
      //         },
      //         {
      //           model: Role,
      //           attributes: { exclude: ['createdAt', 'updatedAt'] },
      //         },
      //         {
      //           model: Organization,
      //           attributes: { exclude: ['createdAt', 'updatedAt'] },
      //         },
      //       ],
      //       attributes: {
      //         exclude: ['person_id', 'role_id', 'organization_id', 'createdAt', 'updatedAt'],
      //       },
      //     },
      //     {
      //       model: OrderStatus,
      //       attributes: { exclude: ['createdAt', 'updatedAt'] },
      //     },
      //   ],
      //   attributes: { exclude: ['user_id', 'order_status_id'] },
      //   where: { order_id: orderJournalFilter.order_id },
      //   limit: order_offset_count,
      //   offset: order_offset_count * (order_offset_page - 1),
      // })
      return { count: orderJournalCount, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(order_journal_id: number): Promise<boolean> {
    try {
      const foundOrderJournal = await this.orderJournalRepository.findOne({
        where: { order_journal_id },
      })

      if (foundOrderJournal) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updateOrderJournalDto: UpdateOrderJournalDto): Promise<StatusOrderJournalResponse> {
    try {
      const updateJournal = await this.orderJournalRepository.update(
        { ...updateOrderJournalDto },
        { where: { order_journal_id: updateOrderJournalDto.order_journal_id } },
      )

      if (updateJournal) {
        return { status: true }
      } else {
        return { status: false }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(order_journal_id: number): Promise<StatusOrderJournalResponse> {
    try {
      const deleteOrderJournal = await this.orderJournalRepository.destroy({
        where: { order_journal_id },
      })

      if (deleteOrderJournal) {
        return { status: true }
      } else {
        return { status: false }
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}
