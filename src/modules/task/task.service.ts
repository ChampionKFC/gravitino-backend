import { Injectable } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { TransactionHistoryService } from '../transaction_history/transaction_history.service';
import { StatusTaskResponse, TaskResponse } from './response';
import { TaskFilter } from './filters';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  generateWhereQuery,
  generateSortQuery,
} from 'src/common/utlis/generate_sort_query';
import getPeriodDates from 'src/common/utlis/get_period_dates';
import { CreateOrderDto } from '../order/dto';
import { FacilityService } from '../facility/facility.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private taskRepository: typeof Task,
    private readonly orderService: OrderService,
    private readonly facilityService: FacilityService,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    task: CreateTaskDto,
    user_id: number,
  ): Promise<StatusTaskResponse> {
    try {
      const transaction = await this.sequelize.transaction();

      const newTask = await this.taskRepository.create(
        { ...task },
        { transaction },
      );

      const dates = getPeriodDates(
        task.periodicity_id,
        task.period_start,
        task.period_end,
      );

      for (let index = 0; index < task.executor_ids.length; index++) {
        const executor_id = task.executor_ids[index];

        const orderDto = new CreateOrderDto();
        orderDto.task_id = newTask.task_id;
        orderDto.order_name = newTask.task_name;
        orderDto.order_description = newTask.task_description;
        orderDto.executor_id = executor_id;
        orderDto.creator_id = user_id;
        orderDto.order_status_id = 1;
        orderDto.priority_id = task.priority_id;

        if (task.facility_ids && task.facility_ids.length > 0) {
          for (let index = 0; index < task.facility_ids.length; index++) {
            const facility_id = task.facility_ids[index];

            for (let index = 0; index < dates.length; index++) {
              const period = dates[index];

              orderDto.facility_id = facility_id;
              orderDto.planned_datetime = period.planned_datetime;
              orderDto.task_end_datetime = period.task_end_datetime;

              await this.orderService
                .create(orderDto, user_id, transaction)
                .catch((e) => {
                  transaction.rollback();
                  throw new Error(e);
                });
            }
          }
        } else if (task.checkpoint_ids && task.checkpoint_ids.length > 0) {
          const facilities = await this.facilityService.findAllByCheckpoint(
            task.checkpoint_ids,
            {},
          );

          for (let index = 0; index < facilities.length; index++) {
            const facility_id = facilities[index].facility_id;

            for (let index = 0; index < dates.length; index++) {
              const period = dates[index];

              orderDto.facility_id = facility_id;
              orderDto.planned_datetime = period.planned_datetime;
              orderDto.task_end_datetime = period.task_end_datetime;

              await this.orderService
                .create(orderDto, user_id, transaction)
                .catch((e) => {
                  transaction.rollback();
                  throw new Error(e);
                });
            }
          }
        } else {
          const facilities = await this.facilityService.findAllByBranch(
            task.branch_ids,
            {},
          );

          for (let index = 0; index < facilities.length; index++) {
            const facility_id = facilities[index].facility_id;

            for (let index = 0; index < dates.length; index++) {
              const period = dates[index];

              orderDto.facility_id = facility_id;
              orderDto.planned_datetime = period.planned_datetime;
              orderDto.task_end_datetime = period.task_end_datetime;

              await this.orderService
                .create(orderDto, user_id, transaction)
                .catch((e) => {
                  transaction.rollback();
                  throw new Error(e);
                });
            }
          }
        }
      }

      const historyDto = {
        user_id: user_id,
        comment: `Создана задача #${newTask.task_id}`,
      };
      await this.historyService.create(historyDto);

      transaction.commit();

      return { status: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(taskFilter: TaskFilter): Promise<TaskResponse[]> {
    try {
      const offset_count =
        taskFilter.offset?.count == undefined ? 50 : taskFilter.offset.count;
      const offset_page =
        taskFilter.offset?.page == undefined ? 1 : taskFilter.offset.page;

      let whereQuery = '';
      if (taskFilter?.filter) {
        whereQuery = generateWhereQuery(taskFilter?.filter);
      }
      let sortQuery = '';
      if (taskFilter?.sorts) {
        sortQuery = generateSortQuery(taskFilter?.sorts);
      }

      const result = await this.sequelize.query<Task>(
        `
        SELECT * FROM (
          SELECT
            "Task"."task_id",
            "Task"."task_name",
            "Task"."task_description",
            "Task"."period_start",
            "Task"."period_end",
            "Task"."createdAt",
            "Task"."updatedAt",
            "category"."category_id" AS "category.category_id",
            "category"."category_name" AS "category.category_name",
            "periodicity"."periodicity_id" AS "periodicity.periodicity_id",
            "periodicity"."periodicity_name" AS "periodicity.periodicity_name"
          FROM
            "Tasks" AS "Task"
            LEFT OUTER JOIN "Categories" AS "category" ON "Task"."category_id" = "category"."category_id"
            LEFT OUTER JOIN "Periodicities" AS "periodicity" ON "Task"."periodicity_id" = "periodicity"."periodicity_id"
        )
        ${whereQuery}
        ${sortQuery}
        LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      );

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(task_id: number): Promise<boolean> {
    try {
      const foundTask = await this.taskRepository.findOne({
        where: { task_id },
      });

      if (foundTask) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    updatedTask: UpdateTaskDto,
    user_id: number,
  ): Promise<TaskResponse> {
    try {
      await this.taskRepository.update(
        { ...updatedTask },
        { where: { task_id: updatedTask.task_id } },
      );

      const foundTask = await this.taskRepository.findOne({
        where: { task_id: updatedTask.task_id },
      });

      if (foundTask) {
        const historyDto = {
          user_id: user_id,
          comment: `Изменена задача #${foundTask.task_id}`,
        };
        await this.historyService.create(historyDto);
      }

      return foundTask;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(task_id: number, user_id: number): Promise<StatusTaskResponse> {
    try {
      const deleteTask = await this.taskRepository.destroy({
        where: { task_id },
      });

      if (deleteTask) {
        const historyDto = {
          user_id: user_id,
          comment: `Удалена задача #${task_id}`,
        };
        await this.historyService.create(historyDto);

        return { status: true };
      }

      return { status: false };
    } catch (error) {
      throw new Error(error);
    }
  }
}
