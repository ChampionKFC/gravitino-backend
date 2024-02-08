import { Injectable } from '@nestjs/common'
import { CreateOrganizationTypeDto, UpdateOrganizationTypeDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { OrganizationType } from './entities/organization_type.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { OrganizationTypeResponse, StatusOrganizationTypeResponse } from './response'
import { OrganizationTypeFilter } from './filters'
import { Sequelize } from 'sequelize-typescript'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { QueryTypes } from 'sequelize'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class OrganizationTypeService {
  constructor(
    @InjectModel(OrganizationType)
    private organizationTypeRepository: typeof OrganizationType,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(organizationType: CreateOrganizationTypeDto, user_id: number): Promise<StatusOrganizationTypeResponse> {
    try {
      const newType = await this.organizationTypeRepository.create({
        ...organizationType,
      })

      const historyDto = {
        user_id: user_id,
        comment: `Создан тип организации #${newType.organization_type_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newType }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(organizationTypeFilter: OrganizationTypeFilter): Promise<ArrayOrganizationTypeResponse> {
    try {
      const offset_count = organizationTypeFilter.offset?.count == undefined ? 50 : organizationTypeFilter.offset.count
      const offset_page = organizationTypeFilter.offset?.page == undefined ? 1 : organizationTypeFilter.offset.page

      let whereQuery = ''
      if (organizationTypeFilter?.filter) {
        whereQuery = generateWhereQuery(organizationTypeFilter?.filter)
      }
      let sortQuery = ''
      if (organizationTypeFilter?.sorts) {
        sortQuery = generateSortQuery(organizationTypeFilter?.sorts)
      }

      const foundTypes = await this.sequelize.query<OrganizationType>(
        `
          SELECT
            "organization_type_id",
            "organization_type_name",
            "createdAt",
            "updatedAt"
          FROM
            "OrganizationTypes" AS "OrganizationType"
          ${whereQuery}
          ${sortQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: foundTypes.length, data: foundTypes }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(organization_type_id: number): Promise<boolean> {
    try {
      const result = await this.organizationTypeRepository.findOne({
        where: { organization_type_id },
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

  async update(updatedOrganizationType: UpdateOrganizationTypeDto, user_id: number): Promise<OrganizationTypeResponse> {
    try {
      let foundType = null
      await this.organizationTypeRepository.update(
        { ...updatedOrganizationType },
        {
          where: {
            organization_type_id: updatedOrganizationType.organization_type_id,
          },
        },
      )

      foundType = await this.organizationTypeRepository.findOne({
        where: {
          organization_type_id: updatedOrganizationType.organization_type_id,
        },
      })

      if (foundType) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ORGANIZATION_TYPE_UPDATED}${foundType.organization_type_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundType
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(organization_type_id: number, user_id: number): Promise<StatusOrganizationTypeResponse> {
    try {
      const deleteType = await this.organizationTypeRepository.destroy({
        where: { organization_type_id },
      })

      if (deleteType) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ORGANIZATION_TYPE_DELETED}${organization_type_id}`,
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
