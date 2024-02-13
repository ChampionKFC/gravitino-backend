import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { BulkCreateOrderDto, CreateOrderDto, UpdateOrderDto, UpdateStatusDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Order } from './entities/order.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { AppError } from 'src/common/constants/error'
import { ArrayOrderResponse, StatusOrderResponse } from './response'
import { Sequelize } from 'sequelize-typescript'
import { MyOrdersFilter, OrderFilter } from './filters'
import { generateSortQuery, generateWhereQuery } from 'src/common/utlis/generate_sort_query'
import { QueryTypes, Transaction } from 'sequelize'
import { OrderJournalService } from '../order_journal/order_journal.service'
import { CreateOrderJournalDto } from '../order_journal/dto'
import { FacilityService } from '../facility/facility.service'
import { AppStrings } from 'src/common/constants/strings'
import { File } from '../files/entities/file.entity'
import { S3BUCKET, S3ENDPOINT } from 'src/common/s3Client'

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(File) private fileRepository: typeof File,
    private readonly facilityService: FacilityService,
    private readonly historyService: TransactionHistoryService,
    private readonly orderJournalService: OrderJournalService,
    private sequelize: Sequelize,
  ) {}

  includeOrders = `SELECT *
  FROM (
    SELECT 
      "Order"."order_id",
      "Order"."order_name",
      "Order"."order_description",
      "Order"."planned_datetime",
      "Order"."task_end_datetime",
      "Order"."ended_at_datetime",
      "Order"."property_values",
      "Order"."createdAt",
      "Order"."updatedAt",
      "task"."task_id" AS "task.task_id",
      "task"."task_name" AS "task.task_name",
      "task"."task_description" AS "task.task_description",
      "category"."category_id" AS "task.category.category_id",
      "category"."category_name" AS "task.category.category_name",
      "periodicity"."periodicity_id" AS "task.periodicity.periodicity_id",
      "periodicity"."periodicity_name" AS "task.periodicity.periodicity_name",
      "task"."period_start" AS "task.period_start",
      "task"."period_end" AS "task.period_end",
      "facility"."facility_id" AS "facility.facility_id",
      "facility"."facility_name" AS "facility.facility_name",
      "facility_organization"."organization_id" AS "facility.organization.organization_id",
      "facility_organization"."full_name" AS "facility.organization.full_name",
      "facility_organization"."short_name" AS "facility.organization.short_name",
      "facility_organization"."phone" AS "facility.organization.phone",
      "facility_organization"."property_values" AS "facility.organization.property_values",
      "facility_organization_type"."organization_type_id" AS "facility.organization.organization_type.organization_type_id",
      "facility_organization_type"."organization_type_name" AS "facility.organization.organization_type.organization_type_name",
      "checkpoint"."checkpoint_id" AS "facility.checkpoint.checkpoint_id",
      "checkpoint_type"."checkpoint_type_id" AS "facility.checkpoint.checkpoint_type.checkpoint_type_id",
      "checkpoint_type"."checkpoint_type_name" AS "facility.checkpoint.checkpoint_type.checkpoint_type_name",
      "checkpoint"."checkpoint_name" AS "facility.checkpoint.checkpoint_name",
      "checkpoint"."address" AS "facility.checkpoint.address",
      "neighboring_state"."neighboring_state_id" AS "facility.checkpoint.neighboring_state.neighboring_state_id",
      "neighboring_state"."neighboring_state_name" AS "facility.checkpoint.neighboring_state.neighboring_state_name",
      "checkpoint"."district" AS "facility.checkpoint.district",
      "checkpoint"."region" AS "facility.checkpoint.region",
      "operating_mode"."operating_mode_id" AS "facility.checkpoint.operating_mode.operating_mode_id",
      "operating_mode"."operating_mode_name" AS "facility.checkpoint.operating_mode.operating_mode_name",
      "working_hours"."working_hours_id" AS "facility.checkpoint.working_hours.working_hours_id",
      "working_hours"."working_hours_name" AS "facility.checkpoint.working_hours.working_hours_name",
      "branch"."branch_id" AS "facility.checkpoint.branch.branch_id",
      "branch"."branch_name" AS "facility.checkpoint.branch.branch_name",
      "branch"."branch_address" AS "facility.checkpoint.branch.branch_address",
      "executor"."organization_id" AS "executor.organization_id",
      "executor"."full_name" AS "executor.full_name",
      "executor"."short_name" AS "executor.short_name",
      "executor"."phone" AS "executor.phone",
      "executor"."property_values" AS "executor.property_values",
      "executor_type"."organization_type_id" AS "executor.organization_type.organization_type_id",
      "executor_type"."organization_type_name" AS "executor.organization_type.organization_type_name",
      "creator"."user_id" AS "creator.user_id",
      "creator"."is_active" AS "creator.is_active",
      "creator"."email" AS "creator.email",
      "creator_role"."role_id" AS "creator.role.role_id",
      "creator_role"."role_name" AS "creator.role.role_name",
      "creator_group"."group_id" AS "creator.group.group_id",
      "creator_group"."group_name" AS "creator.group.group_name",
      "creator_group"."branch_id" AS "creator.group.branch_id",
      "creator_group"."checkpoint_id" AS "creator.group.checkpoint_id",
      "creator_group"."facility_id" AS "creator.group.facility_id",
      "creator_person"."person_id" AS "creator.person.person_id",
      "creator_person"."last_name" AS "creator.person.last_name",
      "creator_person"."first_name" AS "creator.person.first_name",
      "creator_person"."patronymic" AS "creator.person.patronymic",
      "creator_person"."phone" AS "creator.person.phone",
      "creator_organization"."organization_id" AS "creator.organization.organization_id",
      "creator_organization"."full_name" AS "creator.organization.full_name",
      "creator_organization"."short_name" AS "creator.organization.short_name",
      "creator_organization"."phone" AS "creator.organization.phone",
      "creator_organization"."property_values" AS "creator.organization.property_values",
      "creator_organization_type"."organization_type_id" AS "creator.organization.organization_type.organization_type_id",
      "creator_organization_type"."organization_type_name" AS "creator.organization.organization_type.organization_type_name",
      "completed_by"."user_id" AS "completed_by.user_id",
      "completed_by"."is_active" AS "completed_by.is_active",
      "completed_by"."email" AS "completed_by.email",
      "completed_by_role"."role_id" AS "completed_by.role.role_id",
      "completed_by_role"."role_name" AS "completed_by.role.role_name",
      "completed_by_group"."group_id" AS "completed_by.group.group_id",
      "completed_by_group"."group_name" AS "completed_by.group.group_name",
      "completed_by_group"."branch_id" AS "completed_by.group.branch_id",
      "completed_by_group"."checkpoint_id" AS "completed_by.group.checkpoint_id",
      "completed_by_group"."facility_id" AS "completed_by.group.facility_id",
      "completed_by_person"."person_id" AS "completed_by.person.person_id",
      "completed_by_person"."last_name" AS "completed_by.person.last_name",
      "completed_by_person"."first_name" AS "completed_by.person.first_name",
      "completed_by_person"."patronymic" AS "completed_by.person.patronymic",
      "completed_by_person"."phone" AS "completed_by.person.phone",
      "completed_by_organization"."organization_id" AS "completed_by.organization.organization_id",
      "completed_by_organization"."full_name" AS "completed_by.organization.full_name",
      "completed_by_organization"."short_name" AS "completed_by.organization.short_name",
      "completed_by_organization"."phone" AS "completed_by.organization.phone",
      "completed_by_organization"."property_values" AS "completed_by.organization.property_values",
      "completed_by_organization_type"."organization_type_id" AS "completed_by.organization.organization_type.organization_type_id",
      "completed_by_organization_type"."organization_type_name" AS "completed_by.organization.organization_type.organization_type_name",
      "order_status"."order_status_id" AS "order_status.order_status_id",
      "order_status"."order_status_name" AS "order_status.order_status_name",
      "priority"."priority_id" AS "priority.priority_id",
      "priority"."priority_name" AS "priority.priority_name"
    FROM "Orders" AS "Order"
      LEFT JOIN "Tasks" AS "task" ON "Order"."task_id" = "task"."task_id"
      LEFT JOIN "Periodicities" AS "periodicity" ON "task"."periodicity_id" = "periodicity"."periodicity_id"
      LEFT JOIN "Facilities" AS "facility" ON "Order"."facility_id" = "facility"."facility_id"
      LEFT JOIN "Organizations" AS "facility_organization" ON "facility"."organization_id" = "facility_organization"."organization_id"
      LEFT JOIN "OrganizationTypes" AS "facility_organization_type" ON "facility_organization".organization_type_id = "facility_organization_type"."organization_type_id"
      LEFT JOIN "Checkpoints" AS "checkpoint" ON "facility"."checkpoint_id" = "checkpoint"."checkpoint_id"
      LEFT JOIN "CheckpointTypes" AS "checkpoint_type" ON "checkpoint"."checkpoint_type_id" = "checkpoint_type"."checkpoint_type_id"
      LEFT JOIN "WorkingHours" AS "working_hours" ON "checkpoint"."working_hours_id" = "working_hours"."working_hours_id"
      LEFT JOIN "NeighboringStates" AS "neighboring_state" ON "checkpoint"."neighboring_state_id" = "neighboring_state"."neighboring_state_id"
      LEFT JOIN "OperatingModes" AS "operating_mode" ON "checkpoint"."operating_mode_id" = "operating_mode"."operating_mode_id"
      LEFT JOIN "Branches" AS "branch" ON "checkpoint"."branch_id" = "branch"."branch_id"
      LEFT JOIN "Organizations" AS "executor" ON "Order"."executor_id" = "executor"."organization_id"
      LEFT JOIN "OrganizationTypes" AS "executor_type" ON "executor".organization_type_id = "executor_type"."organization_type_id"
      LEFT JOIN "OrderStatuses" AS "order_status" ON "Order"."order_status_id" = "order_status"."order_status_id"
      LEFT JOIN "OrderPriorities" AS "priority" ON "Order"."priority_id" = "priority"."priority_id"
      LEFT JOIN "Categories" AS "category" ON "task"."category_id" = "category"."category_id"
      LEFT JOIN "Users" AS "completed_by" ON "Order"."completed_by" = "completed_by"."user_id"
      LEFT JOIN "People" AS "completed_by_person" ON "completed_by".person_id = "completed_by_person"."person_id"
      LEFT JOIN "Organizations" AS "completed_by_organization" ON "completed_by".organization_id = "completed_by_organization"."organization_id"
      LEFT JOIN "OrganizationTypes" AS "completed_by_organization_type" ON "completed_by_organization".organization_type_id = "completed_by_organization_type"."organization_type_id"
      LEFT JOIN "Roles" AS "completed_by_role" ON "completed_by".role_id = "completed_by_role"."role_id"
      LEFT JOIN "Groups" AS "completed_by_group" ON "completed_by".group_id = "completed_by_group"."group_id"
      LEFT JOIN "Users" AS "creator" ON "Order"."creator_id" = "creator"."user_id"
      LEFT JOIN "People" AS "creator_person" ON "creator".person_id = "creator_person"."person_id"
      LEFT JOIN "Organizations" AS "creator_organization" ON "creator".organization_id = "creator_organization"."organization_id"
      LEFT JOIN "OrganizationTypes" AS "creator_organization_type" ON "creator_organization".organization_type_id = "creator_organization_type"."organization_type_id"
      LEFT JOIN "Roles" AS "creator_role" ON "creator".role_id = "creator_role"."role_id"
      LEFT JOIN "Groups" AS "creator_group" ON "creator".group_id = "creator_group"."group_id"
  ) AS query`

  async create(createOrderDto: CreateOrderDto, user_id: number, transaction?: Transaction): Promise<StatusOrderResponse> {
    try {
      const newOrder = await this.orderRepository.create({ ...createOrderDto }, { transaction })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_ORDER_CREATED} #${newOrder.order_id}`,
      }
      await this.historyService.create(historyDto, transaction)

      const orderJournalDto = new CreateOrderJournalDto()
      orderJournalDto.user_id = user_id
      orderJournalDto.order_id = newOrder.order_id
      orderJournalDto.order_status_id = 1
      orderJournalDto.comment = AppStrings.HISTORY_ORDER_CREATED

      await this.orderJournalService.create(orderJournalDto, transaction)

      return { status: true, data: { ...newOrder, files: [] } }
    } catch (error) {
      throw new Error(error)
    }
  }

  async bulkCreate(order: BulkCreateOrderDto, user_id: number): Promise<StatusOrderResponse> {
    try {
      const transaction = await this.sequelize.transaction()

      for (let index = 0; index < order.executor_ids.length; index++) {
        const executor_id = order.executor_ids[index]

        const orderDto = new CreateOrderDto()
        orderDto.order_name = order.order_name
        orderDto.order_description = order.order_description
        orderDto.executor_id = executor_id
        orderDto.creator_id = user_id
        orderDto.order_status_id = 1
        orderDto.priority_id = order.priority_id

        if (order.facility_ids && order.facility_ids.length > 0) {
          for (let index = 0; index < order.facility_ids.length; index++) {
            const facility_id = order.facility_ids[index]

            orderDto.facility_id = facility_id
            orderDto.planned_datetime = order.planned_datetime
            orderDto.task_end_datetime = order.task_end_datetime

            await this.create(orderDto, user_id, transaction).catch((e) => {
              transaction.rollback()
              throw new Error(e)
            })
          }
        } else if (order.checkpoint_ids && order.checkpoint_ids.length > 0) {
          const facilities = await this.facilityService.findAllByCheckpoint(order.checkpoint_ids, {})

          for (let index = 0; index < facilities.count; index++) {
            const facility_id = facilities[index].facility_id

            orderDto.facility_id = facility_id
            orderDto.planned_datetime = order.planned_datetime
            orderDto.task_end_datetime = order.task_end_datetime

            await this.create(orderDto, user_id, transaction).catch((e) => {
              transaction.rollback()
              throw new Error(e)
            })
          }
        } else {
          const facilities = await this.facilityService.findAllByBranch(order.branch_ids, {})

          for (let index = 0; index < facilities.count; index++) {
            const facility_id = facilities[index].facility_id

            orderDto.facility_id = facility_id
            orderDto.planned_datetime = order.planned_datetime
            orderDto.task_end_datetime = order.task_end_datetime

            await this.create(orderDto, user_id, transaction).catch((e) => {
              transaction.rollback()
              throw new Error(e)
            })
          }
        }
      }

      transaction.commit()

      return { status: true }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(orderFilter: OrderFilter): Promise<ArrayOrderResponse> {
    try {
      const order_offset_count = orderFilter.offset?.count == undefined ? 50 : orderFilter.offset.count
      const order_offset_page = orderFilter.offset?.page == undefined ? 1 : orderFilter.offset.page

      let whereQuery = ''
      if (orderFilter?.filter) {
        whereQuery = generateWhereQuery(orderFilter?.filter)
      }
      let sortQuery = ''
      if (orderFilter?.sorts) {
        sortQuery = generateSortQuery(orderFilter?.sorts)
      }

      const selectQuery = `
        ${this.includeOrders}
        ${whereQuery}
        ${sortQuery}
      `

      const count = (
        await this.sequelize.query<Order>(selectQuery, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const orders = await this.sequelize.query<Order>(
        ` 
        ${selectQuery}
        LIMIT ${order_offset_count} OFFSET ${(order_offset_page - 1) * order_offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      const result = []
      for (const order of orders) {
        const files = await this.fileRepository.findAll({
          where: { order_id: order.order_id },
          attributes: { exclude: ['file_id', 'order_id', 'file_alt', 'file_type_id', 'createdAt', 'updatedAt'] },
        })
        if (files) {
          const links = []
          for (const file of files) {
            links.push(`${S3ENDPOINT}/${S3BUCKET}/${file.file_sku}`)
          }

          order['files'] = links
        } else {
          order['files'] = []
        }

        result.push(order)
      }

      return { count: count, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllByBranch(branch_ids: number[], orderFilter: OrderFilter): Promise<ArrayOrderResponse> {
    try {
      let orders = []

      if (!orderFilter.filter) {
        orderFilter.filter = {}
      }

      for (let index = 0; index < branch_ids.length; index++) {
        const id = branch_ids[index]

        orderFilter.filter.facility = {
          checkpoint: { branch: { branch_id: +id } },
        }
        orders = [...orders, ...(await this.findAll(orderFilter)).data]
      }

      const result = []
      for (const order of orders) {
        const files = await this.fileRepository.findAll({
          where: { order_id: order.order_id },
          attributes: { exclude: ['file_id', 'order_id', 'file_alt', 'file_type_id', 'createdAt', 'updatedAt'] },
        })
        if (files) {
          const links = []
          for (const file of files) {
            links.push(`${S3ENDPOINT}/${S3BUCKET}/${file.file_sku}`)
          }

          order['files'] = links
        } else {
          order['files'] = []
        }

        result.push(order)
      }

      return { count: result.length, data: result }
    } catch (error) {
      console.log(error)

      throw new Error(error)
    }
  }

  async findAllByCheckpoint(checkpoint_ids: number[], orderFilter: OrderFilter): Promise<ArrayOrderResponse> {
    try {
      let orders = []

      if (!orderFilter.filter) {
        orderFilter.filter = {}
      }

      for (let index = 0; index < checkpoint_ids.length; index++) {
        const id = checkpoint_ids[index]

        orderFilter.filter.facility = { checkpoint: { checkpoint_id: +id } }
        orders = [...orders, ...(await this.findAll(orderFilter)).data]
      }

      const result = []
      for (const order of orders) {
        const files = await this.fileRepository.findAll({
          where: { order_id: order.order_id },
          attributes: { exclude: ['file_id', 'order_id', 'file_alt', 'file_type_id', 'createdAt', 'updatedAt'] },
        })
        if (files) {
          const links = []
          for (const file of files) {
            links.push(`${S3ENDPOINT}/${S3BUCKET}/${file.file_sku}`)
          }

          order['files'] = links
        } else {
          order['files'] = []
        }

        result.push(order)
      }

      return { count: result.length, data: result }
    } catch (error) {
      console.log(error)

      throw new Error(error)
    }
  }

  async findMy(myOrdersFilter: MyOrdersFilter, user: any): Promise<ArrayOrderResponse> {
    try {
      const foundUser = await this.sequelize.query(
        `
        SELECT "user"."user_id",
               "group"."group_id" AS "group.group_id",
               "group"."checkpoint_id" AS "group.checkpoint_id",
               "group"."facility_id" AS "group.facility_id",
               "group"."branch_id" AS "group.branch_id",
               "group"."group_id" AS "group.group_id",
               "organization"."organization_id" AS "organization.organization_id"
        FROM "Users" AS "user"
        LEFT JOIN "Groups" AS "group" 
        ON "user"."group_id" = "group"."group_id"
        LEFT JOIN "Organizations" AS "organization" 
        ON "user"."organization_id" = "organization"."organization_id"
        WHERE "user"."user_id" = :user_id;
      `,
        {
          nest: true,
          plain: true,
          type: QueryTypes.SELECT,
          replacements: {
            user_id: user.user_id,
          },
        },
      )

      const u = JSON.parse(JSON.stringify(foundUser))

      if (!u) {
        throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
      }

      let orders
      let count = 0

      const order_offset_count = myOrdersFilter.offset?.count == undefined ? 50 : myOrdersFilter.offset.count
      const order_offset_page = myOrdersFilter.offset?.page == undefined ? 1 : myOrdersFilter.offset.page

      let whereQuery = ''
      if (myOrdersFilter?.filter) {
        whereQuery = generateWhereQuery(myOrdersFilter?.filter)
      }
      if (whereQuery.trim() == '') {
        whereQuery = 'WHERE'
      } else {
        whereQuery += ' AND'
      }

      let sortQuery = ''
      if (myOrdersFilter?.sorts) {
        sortQuery = generateSortQuery(myOrdersFilter?.sorts)
      }

      if (!u.group.group_id && !u.group.checkpoint_id && !u.group.facility_id && u.organization.organization_id) {
        //Рабочий
        const selectQuery = `
          ${this.includeOrders}
          ${whereQuery} planned_datetime between '${myOrdersFilter.period.date_start}' AND '${myOrdersFilter.period.date_end}'
          ${sortQuery}
        `

        count = (
          await this.sequelize.query<Order>(selectQuery, {
            nest: true,
            type: QueryTypes.SELECT,
          })
        ).length
        orders = await this.sequelize.query(
          `
           ${selectQuery}
            LIMIT ${order_offset_count} OFFSET ${(order_offset_page - 1) * order_offset_count};
          `,
          {
            nest: true,
            type: QueryTypes.SELECT,
          },
        )
      } else {
        console.log(u.group)

        if (u.group.facility_id) {
          // Вывод всех задач по всем ПП по объекту обслуживания
          const selectQuery = `
            ${this.includeOrders}
            ${whereQuery} "facility".facility_id = ${u.group.facility_id}
            ${sortQuery}
          `

          count = (
            await this.sequelize.query<Order>(selectQuery, {
              nest: true,
              type: QueryTypes.SELECT,
            })
          ).length
          orders = await this.sequelize.query(
            `
              ${selectQuery}
              LIMIT ${order_offset_count} OFFSET ${(order_offset_page - 1) * order_offset_count};
            `,
            {
              nest: true,
              type: QueryTypes.SELECT,
            },
          )
        } else if (u.group.checkpoint_id) {
          // Вывод всех задач по всем объектам обслуживания по ПП
          const selectQuery = `
            ${this.includeOrders}
            ${whereQuery} "checkpoint".checkpoint_id = ${u.group.checkpoint_id}
            ${sortQuery}
          `

          count = (
            await this.sequelize.query<Order>(selectQuery, {
              nest: true,
              type: QueryTypes.SELECT,
            })
          ).length
          orders = await this.sequelize.query(
            `
              ${selectQuery}
              LIMIT ${order_offset_count} OFFSET ${(order_offset_page - 1) * order_offset_count};
            `,
            {
              nest: true,
              type: QueryTypes.SELECT,
            },
          )
        } else if (u.group.branch_id) {
          // Вывод всех задач по всем ПП по филиалу
          const selectQuery = `
            ${this.includeOrders}
            ${whereQuery} "branch".branch_id = ${u.group.branch_id}
            ${sortQuery}
          `

          count = (
            await this.sequelize.query<Order>(selectQuery, {
              nest: true,
              type: QueryTypes.SELECT,
            })
          ).length
          orders = await this.sequelize.query(
            `
              ${selectQuery}
              LIMIT ${order_offset_count} OFFSET ${(order_offset_page - 1) * order_offset_count};
            `,
            {
              nest: true,
              type: QueryTypes.SELECT,
            },
          )
        } else {
          //Сотрудник ЦА
          const selectQuery = `
            ${this.includeOrders}
            ${sortQuery}
          `

          count = (
            await this.sequelize.query<Order>(selectQuery, {
              nest: true,
              type: QueryTypes.SELECT,
            })
          ).length
          orders = await this.sequelize.query(
            `
              ${selectQuery}
              LIMIT ${order_offset_count} OFFSET ${(order_offset_page - 1) * order_offset_count};
            `,
            {
              nest: true,
              type: QueryTypes.SELECT,
            },
          )
        }
      }

      const result = []
      for (const order of orders) {
        const files = await this.fileRepository.findAll({
          where: { order_id: order.order_id },
          attributes: { exclude: ['file_id', 'order_id', 'file_alt', 'file_type_id', 'createdAt', 'updatedAt'] },
        })
        if (files) {
          const links = []
          for (const file of files) {
            links.push(`${S3ENDPOINT}/${S3BUCKET}/${file.file_sku}`)
          }

          order['files'] = links
        } else {
          order['files'] = []
        }

        result.push(order)
      }

      return { count: count, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(id: number): Promise<boolean> {
    const result = await this.orderRepository.findOne({
      where: { order_id: id },
    })

    if (result) {
      return true
    } else {
      return false
    }
  }

  async update(updateOrderDto: UpdateOrderDto, user_id: number): Promise<StatusOrderResponse> {
    try {
      const foundOrder = await this.orderRepository.findOne({
        where: { order_id: updateOrderDto.order_id },
      })

      foundOrder.update({ ...updateOrderDto })
      const changed = foundOrder.changed()

      if (changed instanceof Array) {
        const orderJournalDto = new CreateOrderJournalDto()
        orderJournalDto.user_id = user_id
        orderJournalDto.order_id = foundOrder.order_id

        for (let index = 0; index < changed.length; index++) {
          const changedField = changed[index]

          orderJournalDto.order_id = foundOrder.order_id
          orderJournalDto.order_status_id = foundOrder.order_status_id
          orderJournalDto.changed_field = changedField
          orderJournalDto.old_value = foundOrder.previous(changedField).toString()
          orderJournalDto.new_value = foundOrder.get(changedField).toString()

          switch (changedField) {
            case 'order_name':
              orderJournalDto.comment = AppStrings.HISTORY_ORDER_NAME_UPDATED
              break
            case 'order_description':
              orderJournalDto.comment = AppStrings.HISTORY_ORDER_DESC_UPDATED
              break
            case 'facility_id':
              orderJournalDto.comment = AppStrings.HISTORY_ORDER_FACILITY_UPDATED
              break
            case 'executor_id':
              orderJournalDto.comment = AppStrings.HISTORY_ORDER_EXECUTOR_UPDATED
              break
            case 'planned_datetime':
              orderJournalDto.comment = AppStrings.HISTORY_ORDER_PLANNED_DATE_UPDATED
              break
            case 'task_end_datetime':
              orderJournalDto.comment = AppStrings.HISTORY_ORDER_END_DATE_UPDATED
              break
            case 'order_status_id':
              orderJournalDto.order_status_id = foundOrder.order_status_id
              orderJournalDto.comment = AppStrings.HISTORY_ORDER_STATUS_UPDATED
              break
            default:
              orderJournalDto.comment = ''
              break
          }

          await this.orderJournalService.create(orderJournalDto)
        }
      }

      if (foundOrder) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ORDER_UPDATED}${foundOrder.order_id}`,
        }
        await this.historyService.create(historyDto)

        return { status: true }
      } else {
        return { status: false }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async changeStatus(updateOrderStatusDto: UpdateStatusDto, user_id: number): Promise<StatusOrderResponse> {
    try {
      const foundOrder = await this.orderRepository.findOne({
        where: { order_id: updateOrderStatusDto.order_id },
      })

      foundOrder.update({
        order_status_id: updateOrderStatusDto.order_status_id,
      })

      const changed = foundOrder.changed()

      if (changed !== false) {
        const orderJournalDto = new CreateOrderJournalDto()
        orderJournalDto.user_id = user_id
        orderJournalDto.order_id = foundOrder.order_id
        orderJournalDto.changed_field = 'order_status_id'
        orderJournalDto.order_status_id = foundOrder.order_status_id
        orderJournalDto.old_value = foundOrder.previous('order_status_id').toString()
        orderJournalDto.new_value = foundOrder.get('order_status_id').toString()
        orderJournalDto.comment = AppStrings.HISTORY_ORDER_STATUS_UPDATED

        await this.orderJournalService.create(orderJournalDto)
      }

      return { status: true }
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(order_id: number, user_id: number): Promise<StatusOrderResponse> {
    try {
      const deleteOrder = await this.orderRepository.destroy({
        where: { order_id },
      })

      if (deleteOrder) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ORDER_DELETED}${order_id}`,
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
