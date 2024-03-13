import { HttpException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFacilityDto, UpdateFacilityDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Facility } from './entities/facility.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayFacilityResponse, FacilityResponse, StatusFacilityResponse } from './response'
import { FacilityFilter } from './filters'
import { QueryTypes, Transaction } from 'sequelize'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { Sequelize } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationType } from '../organization_type/entities/organization_type.entity'

import * as xlsx from 'xlsx'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { FacilityTypeService } from '../facility_type/facility_type.service'
import { AppError } from 'src/common/constants/error'

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility) private facilityRepository: typeof Facility,
    @InjectModel(Organization) private organizationRepository: typeof Organization,
    private readonly checkpointService: CheckpointService,
    private readonly facilityTypeService: FacilityTypeService,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  selectQuery = `SELECT * FROM (
    SELECT
      "Facility"."facility_id",
      "Facility"."facility_name",
      "Facility"."organization_ids",
      "Facility"."createdAt",
      "Facility"."updatedAt",
      "checkpoint"."checkpoint_id" AS "checkpoint.checkpoint_id",
      "checkpoint"."checkpoint_name" AS "checkpoint.checkpoint_name",
      "facility_type"."facility_type_id" AS "facility_type.facility_type_id",
      "facility_type"."facility_type_name" AS "facility_type.facility_type_name",
      "checkpoint"."address" AS "checkpoint.address",
      "checkpoint"."lat" AS "checkpoint.lat",
      "checkpoint"."lng" AS "checkpoint.lng",
      "branch"."branch_id" AS "checkpoint.branch.branch_id",
      "branch"."branch_name" AS "checkpoint.branch.branch_name",
      "branch"."branch_address" AS "checkpoint.branch.branch_address",
      "checkpoint"."district" AS "checkpoint.district",
      "checkpoint"."region" AS "checkpoint.region",
      "checkpoint_type"."checkpoint_type_id" AS "checkpoint.checkpoint_type.checkpoint_type_id",
      "checkpoint_type"."checkpoint_type_name" AS "checkpoint.checkpoint_type.checkpoint_type_name",
      "neighboring_state"."neighboring_state_id" AS "checkpoint.neighboring_state.neighboring_state_id",
      "neighboring_state"."neighboring_state_name" AS "checkpoint.neighboring_state.neighboring_state_name",
      "operating_mode"."operating_mode_id" AS "checkpoint.operating_mode.operating_mode_id",
      "operating_mode"."operating_mode_name" AS "checkpoint.operating_mode.operating_mode_name",
      "working_hours"."working_hours_id" AS "checkpoint.working_hours.working_hours_id",
      "working_hours"."working_hours_name" AS "checkpoint.working_hours.working_hours_name",
      "checkpoint"."property_values" AS "checkpoint.property_values"
    FROM
      "Facilities" AS "Facility"
      LEFT JOIN "Checkpoints" AS "checkpoint" ON "Facility"."checkpoint_id" = "checkpoint"."checkpoint_id"
      LEFT JOIN "CheckpointTypes" AS "checkpoint_type" ON "checkpoint"."checkpoint_type_id" = "checkpoint_type"."checkpoint_type_id"
      LEFT JOIN "FacilityTypes" AS "facility_type" ON "Facility"."facility_type_id" = "facility_type"."facility_type_id"
      LEFT JOIN "Branches" AS "branch" ON "checkpoint"."branch_id" = "branch"."branch_id"
      LEFT JOIN "WorkingHours" AS "working_hours" ON "checkpoint"."working_hours_id" = "working_hours"."working_hours_id"
      LEFT JOIN "NeighboringStates" AS "neighboring_state" ON "checkpoint"."neighboring_state_id" = "neighboring_state"."neighboring_state_id"
      LEFT JOIN "OperatingModes" AS "operating_mode" ON "checkpoint"."operating_mode_id" = "operating_mode"."operating_mode_id"
  ) AS query`

  async create(facility: CreateFacilityDto, user_id: number, trx?: Transaction): Promise<StatusFacilityResponse> {
    const transaction = trx ?? (await this.sequelize.transaction())
    try {
      const newFacility = await this.facilityRepository.create({ ...facility }, { transaction })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_FACILITY_CREATED}${newFacility.facility_id}`,
      }
      await this.historyService.create(historyDto, transaction)

      if (!trx) transaction.commit()
      return { status: true, data: newFacility }
    } catch (error) {
      if (!trx) transaction.rollback()
      throw new Error(error)
    }
  }

  async findAll(facilityFilter?: FacilityFilter): Promise<ArrayFacilityResponse> {
    try {
      const offset_count = facilityFilter.offset?.count == undefined ? 50 : facilityFilter.offset.count
      const offset_page = facilityFilter.offset?.page == undefined ? 1 : facilityFilter.offset.page

      let whereQuery = ''
      if (facilityFilter?.filter) {
        whereQuery = generateWhereQuery(facilityFilter?.filter)
      }
      let sortQuery = ''
      if (facilityFilter?.sorts) {
        sortQuery = generateSortQuery(facilityFilter?.sorts)
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
        await this.sequelize.query<Facility>(query, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const facilities = await this.sequelize.query<Facility>(
        `
        ${query}
        LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      const result = []
      for (const facility of facilities) {
        const organizations = await this.organizationRepository.findAll({ where: { organization_id: facility.organization_ids }, include: [OrganizationType] })
        facility['organizations'] = organizations

        result.push(facility)
      }

      return { count: count, data: result }
    } catch (error) {
      console.log(error)

      throw new Error(error)
    }
  }

  async findByOrganization(organization_id: number) {
    try {
      const facilities = await this.sequelize.query<Facility>(
        `
          ${this.selectQuery}
          WHERE ${organization_id} = ANY(organization_ids)
          ORDER BY "createdAt" DESC;
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return facilities
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOrganizationsByBranch(branch_id: string, include?: boolean) {
    const includeFacilities = include ?? true
    try {
      const facilities = await this.findAll({ filter: { checkpoint: { branch: { branch_id: +branch_id } } } })

      if (facilities.data.length > 0) {
        const organizations = []
        for (const organization of facilities.data[0].organizations) {
          if (includeFacilities) {
            const facilities = await this.findByOrganization(organization.organization_id)
            organization.setDataValue('facilities', facilities)
          }

          organizations.push(organization)
        }

        return organizations
      } else {
        return []
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOrganizationsByFacility(facility_id: number, include?: boolean) {
    const includeFacilities = include ?? true
    try {
      const facilities = await this.findAll({ filter: { facility_id } })

      if (facilities.data.length > 0) {
        const organizations = []
        for (const organization of facilities.data[0].organizations) {
          if (includeFacilities) {
            const facilities = await this.findByOrganization(organization.organization_id)
            organization.setDataValue('facilities', facilities)
          }
          organizations.push(organization)
        }

        return organizations
      } else {
        return []
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOrganizationsByCheckpoint(checkpoint_id: string, include?: boolean) {
    const includeFacilities = include ?? true
    try {
      const facilities = await this.findAll({ filter: { checkpoint: { checkpoint_id: +checkpoint_id } } })

      if (facilities.data.length > 0) {
        const organizations = []
        for (const organization of facilities.data[0].organizations) {
          if (includeFacilities) {
            const facilities = await this.findByOrganization(organization.organization_id)
            organization.setDataValue('facilities', facilities)
          }
          organizations.push(organization)
        }

        return organizations
      } else {
        return []
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(facility_id: number): Promise<FacilityResponse> {
    try {
      const result = await this.facilityRepository.findOne({
        where: { facility_id },
      })

      if (result) {
        return result
      } else {
        return null
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllByBranch(branch_ids: number[], type_ids: number[], facilityFilter: FacilityFilter): Promise<ArrayFacilityResponse> {
    try {
      let result = []

      if (!facilityFilter.filter) {
        facilityFilter.filter = {}
      }

      for (let index = 0; index < branch_ids.length; index++) {
        const id = branch_ids[index]

        facilityFilter.filter.checkpoint = {
          branch: { branch_id: +id },
        }
        result = [...result, ...(await this.findAllByType(type_ids, facilityFilter)).data]
      }

      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllByCheckpoint(checkpoint_ids: number[], type_ids: number[], facilityFilter: FacilityFilter): Promise<ArrayFacilityResponse> {
    try {
      let result = []

      if (!facilityFilter.filter) {
        facilityFilter.filter = {}
      }

      for (let index = 0; index < checkpoint_ids.length; index++) {
        const id = checkpoint_ids[index]

        facilityFilter.filter.checkpoint = { checkpoint_id: +id }
        result = [...result, ...(await this.findAllByType(type_ids, facilityFilter)).data]
      }

      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllByType(type_ids: number[], facilityFilter: FacilityFilter): Promise<ArrayFacilityResponse> {
    try {
      let result = []

      if (!facilityFilter.filter) {
        facilityFilter.filter = {}
      }

      if (type_ids.length > 0) {
        for (let index = 0; index < type_ids.length; index++) {
          const id = type_ids[index]

          facilityFilter.filter.facility_type = { facility_type_id: +id }
          result = [...result, ...(await this.findAll(facilityFilter)).data]
        }
      } else {
        result = (await this.findAll(facilityFilter)).data
      }

      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatedFacility: UpdateFacilityDto, user_id: number, trx?: Transaction): Promise<FacilityResponse> {
    const transaction = await this.sequelize.transaction()
    try {
      await this.facilityRepository.update({ ...updatedFacility }, { where: { checkpoint_id: updatedFacility.facility_id }, transaction })

      const foundFacility = await this.facilityRepository.findOne({
        where: { checkpoint_id: updatedFacility.facility_id },
      })

      if (foundFacility) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_FACILITY_UPDATED}${foundFacility.facility_id}`,
        }
        await this.historyService.create(historyDto, transaction)
      }

      if (!trx) transaction.commit()

      return foundFacility
    } catch (error) {
      if (!trx) transaction.rollback()

      throw new Error(error)
    }
  }

  async remove(facility_id: number, user_id: number): Promise<StatusFacilityResponse> {
    try {
      const deleteFacility = await this.facilityRepository.destroy({
        where: { facility_id },
      })

      if (deleteFacility) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_FACILITY_DELETED}${facility_id}`,
        }
        await this.historyService.create(historyDto)

        return { status: true }
      }

      return { status: false }
    } catch (error) {
      throw new Error(error)
    }
  }

  async import(file: Express.Multer.File, user_id: string): Promise<StatusFacilityResponse> {
    const transaction = await this.sequelize.transaction()

    try {
      const entities = await this.previewImport(file)
      for (const facility of entities) {
        const pk = facility.facility_id
        if (pk) {
          const exists = await this.findOne(pk)
          if (exists) {
            await this.update(facility, +user_id, transaction)
          } else {
            await this.create(facility, +user_id, transaction)
          }
        } else {
          await this.create(facility, +user_id, transaction)
        }
      }

      transaction.commit()
      return { status: true }
    } catch (error) {
      console.log('IMPORT:', error)

      transaction.rollback()
      throw new HttpException(error.message, error.status)
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
          facility_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          facility_name: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          organization_ids: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v ?? [],
          checkpoint_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          facility_type_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
        }

        const checkpoint = await this.checkpointService.findOne(entity.checkpoint_id)
        if (!checkpoint) {
          throw new NotFoundException(`${AppError.CHECKPOINT_NOT_FOUND} (ID: ${entity.checkpoint_id})`)
        }

        const facilityType = await this.facilityTypeService.findOne(entity.facility_type_id)
        if (!facilityType) {
          throw new NotFoundException(`${AppError.FACILITY_TYPE_NOT_FOUND} (ID: ${entity.facility_type_id})`)
        }

        entities.push(entity)
      }

      return entities
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
