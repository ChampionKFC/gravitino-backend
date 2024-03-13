import { Injectable } from '@nestjs/common'
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto'
import { Organization } from './entities/organization.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayOrganizationResponse, OrganizationResponse, StatusOrganizationResponse } from './response'
import { OrganizationFilter } from './filters'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { QueryTypes } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { User } from '../users/entities/user.entity'
import { UserRoles } from 'src/common/constants/constants'
import { FacilityService } from '../facility/facility.service'

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization)
    private organizationRepository: typeof Organization,
    private readonly historyService: TransactionHistoryService,
    private readonly facilityService: FacilityService,
    private readonly sequelize: Sequelize,
  ) {}

  selectQuery = `
    SELECT * FROM (
      SELECT 
        "Organization"."organization_id",
        "Organization"."full_name",
        "Organization"."short_name",
        "Organization"."phone",
        "Organization"."property_values",
        "Organization"."createdAt",
        "Organization"."updatedAt",
        "organization_type"."organization_type_id" AS "organization_type.organization_type_id",
        "organization_type"."organization_type_name" AS "organization_type.organization_type_name",
        "organization_type"."createdAt" AS "organization_type.createdAt",
        "organization_type"."updatedAt" AS "organization_type.updatedAt"
      FROM
        "Organizations" AS "Organization"
      LEFT JOIN "OrganizationTypes" AS "organization_type" ON "Organization"."organization_type_id" = "organization_type"."organization_type_id"
    ) AS query
  `

  async create(organization: CreateOrganizationDto, user_id: number): Promise<StatusOrganizationResponse> {
    try {
      const newOrganization = await this.organizationRepository.create({
        ...organization,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_ORGANIZATION_CREATED}${newOrganization.organization_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newOrganization }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(organizationFilter: OrganizationFilter): Promise<ArrayOrganizationResponse> {
    try {
      const offset_count = organizationFilter.offset?.count == undefined ? 50 : organizationFilter.offset.count
      const offset_page = organizationFilter.offset?.page == undefined ? 1 : organizationFilter.offset.page

      let whereQuery = ''
      if (organizationFilter?.filter) {
        whereQuery = generateWhereQuery(organizationFilter?.filter)
      }
      let sortQuery = ''
      if (organizationFilter?.sorts) {
        sortQuery = generateSortQuery(organizationFilter?.sorts)
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
        await this.sequelize.query<Organization>(query, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const result = await this.sequelize.query<Organization>(
        `
        ${query}
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

  async findMy(organizationFilter: OrganizationFilter, user_id: number): Promise<ArrayOrganizationResponse> {
    try {
      const foundUser = await this.sequelize.query<User>(
        `
        SELECT "user"."user_id",
               "user"."role_id",
               "group"."branch_id" AS "group.branch_id",
               "group"."checkpoint_id" AS "group.checkpoint_id",
               "group"."facility_id" AS "group.facility_id"
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

      const offset_count = organizationFilter.offset?.count == undefined ? 50 : organizationFilter.offset.count
      const offset_page = organizationFilter.offset?.page == undefined ? 1 : organizationFilter.offset.page

      let whereQuery = ''
      if (organizationFilter?.filter) {
        whereQuery = generateWhereQuery(organizationFilter?.filter)
      }
      let sortQuery = ''
      if (organizationFilter?.sorts) {
        sortQuery = generateSortQuery(organizationFilter?.sorts)
      }

      if (sortQuery == '') {
        sortQuery = 'ORDER BY "createdAt" DESC'
      }

      let query = ``
      const branch_id = foundUser.group.branch_id
      const checkpoint_id = foundUser.group.checkpoint_id
      const facility_id = foundUser.group.facility_id

      const organization_ids = []

      if (foundUser.role_id == UserRoles.BRANCH_WORKER && branch_id) {
        const facilities = (await this.facilityService.findAllByBranch([branch_id], [], {})).data
        facilities.forEach((organization) => {
          organization_ids.push(...organization.organization_ids)
        })

        if (whereQuery == '') whereQuery = 'WHERE'
        else whereQuery += ' AND'

        query = `
          ${this.selectQuery}
          ${whereQuery} "organization_id" IN (${organization_ids})
          ${sortQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `
      } else if ((foundUser.role_id == UserRoles.CHECKPOINT_WORKER || foundUser.role_id == UserRoles.CHECKPOINT_CHIEF_ENGINEER) && checkpoint_id) {
        const facilities = (await this.facilityService.findAllByCheckpoint([checkpoint_id], [], {})).data
        facilities.forEach((organization) => {
          organization_ids.push(...organization.organization_ids)
        })

        if (whereQuery == '') whereQuery = 'WHERE'
        else whereQuery += ' AND'

        query = `
          ${this.selectQuery}
          ${whereQuery} "organization_id" IN (${organization_ids})
          ${sortQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `
      } else if (facility_id) {
        const facility = await this.facilityService.findOne(facility_id)
        organization_ids.push(...facility.organization_ids)

        if (whereQuery == '') whereQuery = 'WHERE'
        else whereQuery += ' AND'

        query = `
          ${this.selectQuery}
          ${whereQuery} "organization_id" IN (${organization_ids})
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
        await this.sequelize.query<Organization>(query, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const result = await this.sequelize.query<Organization>(
        `
          ${query}
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

  async findOne(organization_id: number): Promise<boolean> {
    try {
      const result = await this.organizationRepository.findOne({
        where: { organization_id },
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

  async update(updatedOrganization: UpdateOrganizationDto, user_id: number): Promise<OrganizationResponse> {
    try {
      let foundOrganization = null
      await this.organizationRepository.update({ ...updatedOrganization }, { where: { organization_id: updatedOrganization.organization_id } })

      foundOrganization = await this.organizationRepository.findOne({
        where: { organization_id: updatedOrganization.organization_id },
      })

      if (foundOrganization) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ORGANIZATION_UPDATED}${foundOrganization.organization_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundOrganization
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(organization_id: number, user_id: number): Promise<StatusOrganizationResponse> {
    try {
      const deleteOrganization = await this.organizationRepository.destroy({
        where: { organization_id },
      })

      if (deleteOrganization) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ORGANIZATION_DELETED}${organization_id}`,
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
