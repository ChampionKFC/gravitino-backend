import { Injectable } from '@nestjs/common'
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto'
import { Organization } from './entities/organization.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayOrganizationResponse, OrganizationResponse, StatusOrganizationResponse } from './response'
import { OrganizationFilter } from './filters'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { Op, QueryTypes } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity'
import { Facility } from '../facility/entities/facility.entity'
import { OrganizationType } from '../organization_type/entities/organization_type.entity'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization)
    private organizationRepository: typeof Organization,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

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

      const result = await this.sequelize.query<Organization>(
        `
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
        )
        ${whereQuery}
        ${sortQuery}
        LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllByCheckpoint(checkpoint_id: number): Promise<ArrayOrganizationResponse> {
    try {
      const result = await this.organizationRepository.findAll({
        include: [
          OrganizationType,
          { model: Facility, as: 'facilities', where: { facility_id: { [Op.ne]: null } }, include: [{ model: Checkpoint, where: { checkpoint_id } }] },
        ],
      })

      return { count: result.length, data: result }
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
