import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'
import { CreateCheckpointDto, UpdateCheckpointDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Checkpoint } from './entities/checkpoint.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayCheckpointResponse, CheckpointResponse, StatusCheckpointResponse } from './response'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { CheckpointFilter } from './filters'
import { QueryTypes, Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { HttpService } from '@nestjs/axios'
import { AppStrings } from 'src/common/constants/strings'
import { ConfigService } from '@nestjs/config'
import { catchError, lastValueFrom, map } from 'rxjs'
import { ReportService } from '../report/report.service'
import { AppError } from 'src/common/constants/error'
import { User } from '../users/entities/user.entity'
import { UserRoles } from 'src/common/constants/constants'

import * as xlsx from 'xlsx'
import { BranchService } from '../branch/branch.service'
import { NeighboringStateService } from '../neighboring_state/neighboring_state.service'
import { CheckpointTypeService } from '../checkpoint_type/checkpoint_type.service'
import { OperatingModeService } from '../operating_mode/operating_mode.service'
import { WorkingHoursService } from '../working_hours/working_hours.service'

@Injectable()
export class CheckpointService {
  constructor(
    @InjectModel(Checkpoint) private checkpointRepository: typeof Checkpoint,
    private readonly historyService: TransactionHistoryService,
    private readonly branchService: BranchService,
    private readonly neighboringStateService: NeighboringStateService,
    private readonly checkpointTypeService: CheckpointTypeService,
    private readonly operatingModeService: OperatingModeService,
    private readonly workingHoursService: WorkingHoursService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ReportService)) private readonly reportService: ReportService,
    private readonly sequelize: Sequelize,
    private http: HttpService,
  ) {}

  selectQuery = `
    SELECT * FROM (
      SELECT
        "checkpoint_id",
        "checkpoint_name",
        "address",
        "lat",
        "lng",
        "Checkpoint"."createdAt",
        "Checkpoint"."updatedAt",
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
  `

  async create(checkpoint: CreateCheckpointDto, user_id: number, trx?: Transaction): Promise<StatusCheckpointResponse> {
    const transaction = trx ?? (await this.sequelize.transaction())
    try {
      const coordinates = await this.decodeAddress(checkpoint.address)

      if (coordinates) {
        const newCheckpoint = await this.checkpointRepository.create({
          ...checkpoint,
          lat: Number(coordinates[0]),
          lng: Number(coordinates[1]),
          transaction,
        })

        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_CHECKPOINT_CREATED}${newCheckpoint.checkpoint_id}`,
        }
        await this.historyService.create(historyDto, transaction)

        if (!trx) transaction.commit()
        return { status: true, data: newCheckpoint }
      } else {
        if (!trx) transaction.rollback()
        throw new HttpException(AppError.ADDRESS_NOT_FOUND, HttpStatus.BAD_REQUEST)
      }
    } catch (error) {
      if (!trx) transaction.rollback()
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
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

      if (sortQuery == '') {
        sortQuery = 'ORDER BY "createdAt" DESC'
      }

      const query = `
        ${this.selectQuery}
        ${whereQuery}
        ${sortQuery}
      `

      const count = (
        await this.sequelize.query<Checkpoint>(query, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const result = await this.sequelize.query<Checkpoint>(
        `
        ${query}
        LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      const checkpoints = []
      for (const checkpoint of result) {
        const report = await this.reportService.generateOneCheckpointReport(checkpoint.checkpoint_id)
        checkpoint['report'] = report

        const minCompletedCountFilter = checkpointFilter.report_filter?.min_completed_count ?? -1
        const maxCompletedCountFilter = checkpointFilter.report_filter?.max_completed_count ?? Infinity
        const minCompletedPercentFilter = checkpointFilter.report_filter?.min_completed_percent ?? -1
        const maxCompletedPercentFilter = checkpointFilter.report_filter?.max_completed_percent ?? Infinity
        const minCheckedCountFilter = checkpointFilter.report_filter?.min_checked_count ?? -1
        const maxCheckedCountFilter = checkpointFilter.report_filter?.max_checked_count ?? Infinity
        const minCheckedPercentFilter = checkpointFilter.report_filter?.min_checked_percent ?? -1
        const maxCheckedPercentFilter = checkpointFilter.report_filter?.max_checked_percent ?? Infinity

        if (
          report.completed_count >= minCompletedCountFilter &&
          report.completed_count <= maxCompletedCountFilter &&
          Number(report.completed_percent) >= minCompletedPercentFilter &&
          Number(report.completed_percent) <= maxCompletedPercentFilter &&
          report.checked_count >= minCheckedCountFilter &&
          report.checked_count <= maxCheckedCountFilter &&
          Number(report.checked_percent) >= minCheckedPercentFilter &&
          Number(report.checked_percent) <= maxCheckedPercentFilter
        ) {
          checkpoints.push(checkpoint)
        }
      }

      return { count: count, data: checkpoints }
    } catch (error) {
      console.log(error)

      throw new Error(error)
    }
  }

  async findMy(user_id: number, checkpointFilter?: CheckpointFilter): Promise<ArrayCheckpointResponse> {
    try {
      const foundUser = await this.sequelize.query<User>(
        `
        SELECT "user"."user_id",
               "user"."role_id",
               "group"."checkpoint_id" AS "group.checkpoint_id",
               "group"."branch_id" AS "group.branch_id",
               "group"."group_id" AS "group.group_id"
        FROM "Users" AS "user"
        LEFT JOIN "Groups" AS "group" 
        ON "user"."group_id" = "group"."group_id"
        WHERE "user"."user_id" = :user_id;
      `,
        {
          nest: true,
          plain: true,
          type: QueryTypes.SELECT,
          replacements: {
            user_id: user_id,
          },
        },
      )

      if (!foundUser) {
        throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
      } else {
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
        if (sortQuery == '') {
          sortQuery = 'ORDER BY "createdAt" DESC'
        }

        let query = ``
        const branch_id = foundUser.group.branch_id
        const checkpoint_id = foundUser.group.checkpoint_id
        if (foundUser.role_id == UserRoles.BRANCH_WORKER && branch_id) {
          if (whereQuery == '') whereQuery = 'WHERE'
          else whereQuery += ' AND'

          query = `
            ${this.selectQuery}
            ${whereQuery} "branch.branch_id" = ${branch_id}
            ${sortQuery}
            LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
          `
        } else if ((foundUser.role_id == UserRoles.CHECKPOINT_WORKER || foundUser.role_id == UserRoles.CHECKPOINT_CHIEF_ENGINEER) && checkpoint_id) {
          if (whereQuery == '') whereQuery = 'WHERE'
          else whereQuery += ' AND'

          query = `
            ${this.selectQuery}
            ${whereQuery} "checkpoint_id" = ${checkpoint_id}
            ${sortQuery}
            LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
          `
        } else if (foundUser.role_id == UserRoles.ADMIN) {
          query = `
            ${this.selectQuery}
            ${whereQuery}
            ${sortQuery}
            LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
          `
        }

        const count = (
          await this.sequelize.query<Checkpoint>(query, {
            nest: true,
            type: QueryTypes.SELECT,
          })
        ).length
        const result = await this.sequelize.query<Checkpoint>(
          `
          ${query}
          `,
          {
            nest: true,
            type: QueryTypes.SELECT,
          },
        )

        const checkpoints = []
        for (const checkpoint of result) {
          const report = await this.reportService.generateOneCheckpointReport(checkpoint.checkpoint_id)
          checkpoint['report'] = report

          const minCompletedCountFilter = checkpointFilter.report_filter?.min_completed_count ?? -1
          const maxCompletedCountFilter = checkpointFilter.report_filter?.max_completed_count ?? Infinity
          const minCompletedPercentFilter = checkpointFilter.report_filter?.min_completed_percent ?? -1
          const maxCompletedPercentFilter = checkpointFilter.report_filter?.max_completed_percent ?? Infinity
          const minCheckedCountFilter = checkpointFilter.report_filter?.min_checked_count ?? -1
          const maxCheckedCountFilter = checkpointFilter.report_filter?.max_checked_count ?? Infinity
          const minCheckedPercentFilter = checkpointFilter.report_filter?.min_checked_percent ?? -1
          const maxCheckedPercentFilter = checkpointFilter.report_filter?.max_checked_percent ?? Infinity

          if (
            report.completed_count >= minCompletedCountFilter &&
            report.completed_count <= maxCompletedCountFilter &&
            Number(report.completed_percent) >= minCompletedPercentFilter &&
            Number(report.completed_percent) <= maxCompletedPercentFilter &&
            report.checked_count >= minCheckedCountFilter &&
            report.checked_count <= maxCheckedCountFilter &&
            Number(report.checked_percent) >= minCheckedPercentFilter &&
            Number(report.checked_percent) <= maxCheckedPercentFilter
          ) {
            checkpoints.push(checkpoint)
          }
        }

        return { count: count, data: checkpoints }
      }
    } catch (error) {
      console.log(error)
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

  async update(updatedCheckpoint: UpdateCheckpointDto, user_id: number, trx?: Transaction): Promise<CheckpointResponse> {
    const transaction = trx ?? (await this.sequelize.transaction())
    try {
      let lat
      let lng
      if (updatedCheckpoint.address) {
        const coordinates = await this.decodeAddress(updatedCheckpoint.address)

        if (coordinates) {
          lat = Number(coordinates[0])
          lng = Number(coordinates[0])
        }
      }

      let foundCheckpoint = null
      await this.checkpointRepository.update({ ...updatedCheckpoint, lat, lng }, { where: { checkpoint_id: updatedCheckpoint.checkpoint_id }, transaction })

      foundCheckpoint = await this.checkpointRepository.findOne({
        where: { checkpoint_id: updatedCheckpoint.checkpoint_id },
      })

      if (foundCheckpoint) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_CHECKPOINT_UPDATED}${foundCheckpoint.checkpoint_id}`,
        }
        await this.historyService.create(historyDto, transaction)

        if (!trx) transaction.commit()
      } else {
        if (!trx) transaction.rollback()
      }

      return foundCheckpoint
    } catch (error) {
      if (!trx) transaction.rollback()
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
        .pipe(map((response) => response.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.Point?.pos))
        .pipe(
          catchError((e) => {
            throw new Error(e)
          }),
        )

      const rawCoordinates: string = await lastValueFrom(data)

      if (rawCoordinates) {
        const coordinates = rawCoordinates.split(' ')

        return coordinates
      } else {
        return null
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async import(file: Express.Multer.File, user_id: string): Promise<StatusCheckpointResponse> {
    const transaction = await this.sequelize.transaction()

    try {
      const entities = await this.previewImport(file)
      for (const entity of entities) {
        const pk = entity.checkpoint_id
        if (pk) {
          const exists = await this.findOne(pk)
          if (exists) {
            await this.update(entity, +user_id, transaction)
          } else {
            await this.create(entity, +user_id, transaction)
          }
        } else {
          await this.create(entity, +user_id, transaction)
        }
      }

      transaction.commit()
      return { status: true }
    } catch (error) {
      console.log('IMPORT:', error)

      transaction.rollback()
      throw new Error(error)
    }
  }

  async previewImport(file: Express.Multer.File): Promise<any> {
    try {
      const workbook = xlsx.read(file.buffer)

      const ws = workbook.Sheets[workbook.SheetNames[0]]
      const range = xlsx.utils.decode_range(ws['!ref'])

      const entities = []

      for (let R = range.s.r; R <= range.e.r; ++R) {
        if (R === 0) {
          continue
        }
        let col = 0

        const entity = {
          checkpoint_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          checkpoint_name: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          address: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          branch_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          neighboring_state_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          district: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          region: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          checkpoint_type_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          operating_mode_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          working_hours_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          property_values: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v?.toString().split(';'),
        }

        const branch = await this.branchService.findOne(entity.branch_id)
        if (!branch) {
          throw new NotFoundException(`${AppError.BRANCH_NOT_FOUND} (ID: ${entity.branch_id})`)
        }

        const neighboringState = await this.neighboringStateService.findOne(entity.neighboring_state_id)
        if (!neighboringState) {
          throw new NotFoundException(`${AppError.NEIGHBORING_STATE_NOT_FOUND} (ID: ${entity.neighboring_state_id})`)
        }

        const checkpointType = await this.checkpointTypeService.findOne(entity.checkpoint_type_id)
        if (!checkpointType) {
          throw new NotFoundException(`${AppError.CHECKPOINT_TYPE_NOT_FOUND} (ID: ${entity.checkpoint_type_id})`)
        }

        const operatingMode = await this.operatingModeService.findOne(entity.operating_mode_id)
        if (!operatingMode) {
          throw new NotFoundException(`${AppError.OPERATING_MODE_NOT_FOUND} (ID: ${entity.operating_mode_id})`)
        }

        const workingHours = await this.workingHoursService.findOne(entity.working_hours_id)
        if (!workingHours) {
          throw new NotFoundException(`${AppError.WORKING_HOURS_NOT_FOUND} (ID: ${entity.working_hours_id})`)
        }

        entities.push(entity)
      }

      return entities
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
