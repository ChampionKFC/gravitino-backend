import { Injectable } from '@nestjs/common'
import { CreateFacilityDto, UpdateFacilityDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Facility } from './entities/facility.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayFacilityResponse, FacilityResponse, StatusFacilityResponse } from './response'
import { FacilityFilter } from './filters'
import { QueryTypes } from 'sequelize'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { Sequelize } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { OrganizationService } from '../organization/organization.service'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationType } from '../organization_type/entities/organization_type.entity'

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility) private facilityRepository: typeof Facility,
    @InjectModel(Organization) private organizationRepository: typeof Organization,
    private readonly organizationService: OrganizationService,
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

  async create(facility: CreateFacilityDto, user_id: number): Promise<StatusFacilityResponse> {
    try {
      const newFacility = await this.facilityRepository.create({ ...facility })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_FACILITY_CREATED}${newFacility.facility_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newFacility }
    } catch (error) {
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
          WHERE ${organization_id} = ANY(organization_ids);
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

  async findOrganizationsByFacility(facility_id: number) {
    try {
      const facilities = await this.findAll({ filter: { facility_id } })

      const organizations = []
      for (const organization of facilities.data[0].organizations) {
        const facilities = await this.findByOrganization(organization.organization_id)
        organization.setDataValue('facilities', facilities)
        organizations.push(organization)
      }

      return organizations
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOrganizationsByCheckpoint(checkpoint_id: string) {
    try {
      const facilities = await this.findAll({ filter: { checkpoint: { checkpoint_id: +checkpoint_id } } })

      const organizations = []
      for (const organization of facilities.data[0].organizations) {
        const facilities = await this.findByOrganization(organization.organization_id)
        organization.setDataValue('facilities', facilities)
        organizations.push(organization)
      }

      return organizations
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(facility_id: number): Promise<boolean> {
    try {
      const result = await this.facilityRepository.findOne({
        where: { facility_id },
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

  async update(updatedFacility: UpdateFacilityDto, user_id: number): Promise<FacilityResponse> {
    try {
      await this.facilityRepository.update({ ...updatedFacility }, { where: { checkpoint_id: updatedFacility.facility_id } })

      const foundFacility = await this.facilityRepository.findOne({
        where: { checkpoint_id: updatedFacility.facility_id },
      })

      if (foundFacility) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_FACILITY_UPDATED}${foundFacility.facility_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundFacility
    } catch (error) {
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
}
