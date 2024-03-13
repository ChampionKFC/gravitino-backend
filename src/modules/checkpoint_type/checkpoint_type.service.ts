import { Injectable } from '@nestjs/common'
import { CreateCheckpointTypeDto, UpdateCheckpointTypeDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { CheckpointType } from './entities/checkpoint_type.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayCheckpointTypeResponse, CheckpointTypeResponse, StatusCheckpointTypeResponse } from './response'
import { CheckpointTypeFilter } from './filters'
import { QueryTypes } from 'sequelize'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { Sequelize } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class CheckpointTypeService {
  constructor(
    @InjectModel(CheckpointType)
    private checkpointTypeRepository: typeof CheckpointType,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createCheckpointTypeDto: CreateCheckpointTypeDto, user_id: number): Promise<StatusCheckpointTypeResponse> {
    try {
      const newCheckpointType = await this.checkpointTypeRepository.create({
        ...createCheckpointTypeDto,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_CHECKPOINT_TYPE_CREATED}${newCheckpointType.checkpoint_type_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newCheckpointType }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(checkpointTypeFilter?: CheckpointTypeFilter): Promise<ArrayCheckpointTypeResponse> {
    try {
      const offset_count = checkpointTypeFilter.offset?.count == undefined ? 50 : checkpointTypeFilter.offset.count
      const offset_page = checkpointTypeFilter.offset?.page == undefined ? 1 : checkpointTypeFilter.offset.page

      let whereQuery = ''
      if (checkpointTypeFilter?.filter) {
        whereQuery = generateWhereQuery(checkpointTypeFilter?.filter)
      }
      let sortQuery = ''
      if (checkpointTypeFilter?.sorts) {
        sortQuery = generateSortQuery(checkpointTypeFilter?.sorts)
      }

      if (sortQuery == '') {
        sortQuery = 'ORDER BY "createdAt" DESC'
      }

      const selectQuery = `
        SELECT
          "checkpoint_type_id",
          "checkpoint_type_name",
          "createdAt",
          "updatedAt"
        FROM
          "CheckpointTypes" AS "CheckpointType"
        ${whereQuery}
        ${sortQuery}
      `

      const count = (
        await this.sequelize.query<CheckpointType>(selectQuery, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const foundCheckpointTypes = await this.sequelize.query<CheckpointType>(
        `
          ${selectQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: count, data: foundCheckpointTypes }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(checkpoint_type_id: number): Promise<boolean> {
    try {
      const result = await this.checkpointTypeRepository.findOne({
        where: { checkpoint_type_id },
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

  async update(updateCheckpointTypeDto: UpdateCheckpointTypeDto, user_id: number): Promise<CheckpointTypeResponse> {
    try {
      let foundCheckpointType = null
      await this.checkpointTypeRepository.update(
        { ...updateCheckpointTypeDto },
        {
          where: {
            checkpoint_type_id: updateCheckpointTypeDto.checkpoint_type_id,
          },
        },
      )

      foundCheckpointType = await this.checkpointTypeRepository.findOne({
        where: {
          checkpoint_type_id: updateCheckpointTypeDto.checkpoint_type_id,
        },
      })

      if (foundCheckpointType) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_CHECKPOINT_TYPE_UPDATED}${updateCheckpointTypeDto.checkpoint_type_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundCheckpointType
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(checkpoint_type_id: number, user_id: number): Promise<StatusCheckpointTypeResponse> {
    try {
      const deleteCheckpointType = await this.checkpointTypeRepository.destroy({
        where: { checkpoint_type_id },
      })

      if (deleteCheckpointType) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_CHECKPOINT_TYPE_DELETED}${checkpoint_type_id}`,
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
