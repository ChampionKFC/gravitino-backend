import { Injectable } from '@nestjs/common'
import { CreateCheckpointDto, UpdateCheckpointDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Checkpoint } from './entities/checkpoint.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayCheckpointResponse, CheckpointResponse, StatusCheckpointResponse } from './response'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { CheckpointFilter } from './filters'
import { QueryTypes } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { HttpService } from '@nestjs/axios'
import { AppStrings } from 'src/common/constants/strings'
import { ConfigService } from '@nestjs/config'
import { catchError, lastValueFrom, map } from 'rxjs'

@Injectable()
export class CheckpointService {
  constructor(
    @InjectModel(Checkpoint) private checkpointRepository: typeof Checkpoint,
    private readonly historyService: TransactionHistoryService,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
    private http: HttpService,
  ) {}

  async create(checkpoint: CreateCheckpointDto, user_id: number): Promise<StatusCheckpointResponse> {
    try {
      const coordinates = await this.decodeAddress(checkpoint.address)

      const newCheckpoint = await this.checkpointRepository.create({
        ...checkpoint,
        lat: Number(coordinates[0]),
        lng: Number(coordinates[1]),
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_CHECKPOINT_CREATED}${newCheckpoint.checkpoint_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newCheckpoint }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(checkpointFilter?: CheckpointFilter): Promise<ArrayCheckpointResponse> {
    try {
      const offset_count = checkpointFilter.offset?.count == undefined ? 50 : checkpointFilter.offset.count
      const offset_page = checkpointFilter.offset?.page == undefined ? 1 : checkpointFilter.offset.page

      let whereQuery = ''
      if (checkpointFilter?.filter) {
        whereQuery = generateWhereQuery(checkpointFilter?.filter)
      }
      let sortQuery = ''
      if (checkpointFilter?.sorts) {
        sortQuery = generateSortQuery(checkpointFilter?.sorts)
      }

      const selectQuery = `
        SELECT * FROM (
          SELECT
            "checkpoint_id",
            "checkpoint_name",
            "address",
            "lat",
            "lng",
            "branch"."branch_id" AS "branch.branch_id",
            "branch"."branch_name" AS "branch.branch_name",
            "branch"."branch_address" AS "branch.branch_address",
            "district",
            "region",
            "checkpoint_type"."checkpoint_type_id" AS "checkpoint_type.checkpoint_type_id",
            "checkpoint_type"."checkpoint_type_name" AS "checkpoint_type.checkpoint_type_name",
            "neighboring_state"."neighboring_state_id" AS "neighboring_state.neighboring_state_id",
            "neighboring_state"."neighboring_state_name" AS "neighboring_state.neighboring_state_name",
            "operating_mode"."operating_mode_id" AS "operating_mode.operating_mode_id",
            "operating_mode"."operating_mode_name" AS "operating_mode.operating_mode_name",
            "working_hours"."working_hours_id" AS "working_hours.working_hours_id",
            "working_hours"."working_hours_name" AS "working_hours.working_hours_name",
            "property_values"
          FROM 
            "Checkpoints" AS "Checkpoint"
            LEFT JOIN "CheckpointTypes" AS "checkpoint_type" ON "Checkpoint"."checkpoint_type_id" = "checkpoint_type"."checkpoint_type_id"
            LEFT JOIN "Branches" AS "branch" ON "Checkpoint"."branch_id" = "branch"."branch_id"
            LEFT JOIN "WorkingHours" AS "working_hours" ON "Checkpoint"."working_hours_id" = "working_hours"."working_hours_id"
            LEFT JOIN "NeighboringStates" AS "neighboring_state" ON "Checkpoint"."neighboring_state_id" = "neighboring_state"."neighboring_state_id"
            LEFT JOIN "OperatingModes" AS "operating_mode" ON "Checkpoint"."operating_mode_id" = "operating_mode"."operating_mode_id"
        ) AS query
        ${whereQuery}
        ${sortQuery}
      `

      const count = (
        await this.sequelize.query<Checkpoint>(selectQuery, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const result = await this.sequelize.query<Checkpoint>(
        `
        ${selectQuery}
        LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: count, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(checkpoint_id: number): Promise<boolean> {
    try {
      const foundCheckpoint = await this.checkpointRepository.findOne({
        where: { checkpoint_id },
      })

      if (foundCheckpoint) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllByBranch(branch_ids: number[], checkpointFilter?: CheckpointFilter): Promise<ArrayCheckpointResponse> {
    try {
      let result = []

      if (!checkpointFilter.filter) {
        checkpointFilter.filter = {}
      }

      for (let index = 0; index < branch_ids.length; index++) {
        const id = branch_ids[index]

        checkpointFilter.filter.branch = {
          branch_id: +id,
        }
        result = [...result, ...(await this.findAll(checkpointFilter)).data]
      }

      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatedCheckpoint: UpdateCheckpointDto, user_id: number): Promise<CheckpointResponse> {
    try {
      let foundCheckpoint = null
      await this.checkpointRepository.update({ ...updatedCheckpoint }, { where: { checkpoint_id: updatedCheckpoint.checkpoint_id } })

      foundCheckpoint = await this.checkpointRepository.findOne({
        where: { checkpoint_id: updatedCheckpoint.checkpoint_id },
      })

      if (foundCheckpoint) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_CHECKPOINT_UPDATED}${foundCheckpoint.checkpoint_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundCheckpoint
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(checkpoint_id: number, user_id: number): Promise<StatusCheckpointResponse> {
    const deleteCheckpoint = await this.checkpointRepository.destroy({
      where: { checkpoint_id },
    })

    if (deleteCheckpoint) {
      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_CHECKPOINT_DELETED}${checkpoint_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true }
    }

    return { status: false }
  }

  async decodeAddress(address: string): Promise<string[]> {
    try {
      const data = this.http
        .get(`${AppStrings.YMAPS_GEOCODER_URL}&apikey=${this.configService.get('ymaps_api_key')}&geocode=${address}`)
        .pipe(map((response) => response.data?.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos))
        .pipe(
          catchError((e) => {
            throw new Error(e)
          }),
        )

      const rawCoordinates: string = await lastValueFrom(data)
      const coordinates = rawCoordinates.split(' ')

      return coordinates
    } catch (error) {
      throw new Error(error)
    }
  }
}
