import { Injectable } from '@nestjs/common'
import { CreateRoleDto, UpdateRoleDto } from './dto'
import { Role } from './entities/role.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayRoleResponse, RoleResponse, StatusRoleResponse } from './response'
import { RoleFilter } from './filters'
import { Sequelize } from 'sequelize-typescript'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { QueryTypes } from 'sequelize'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(role: CreateRoleDto, user_id: number): Promise<StatusRoleResponse> {
    try {
      const newRole = await this.roleRepository.create({ ...role })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_ROLE_CREATED}${newRole.role_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newRole }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(roleFilter: RoleFilter): Promise<ArrayRoleResponse> {
    try {
      const offset_count = roleFilter.offset?.count == undefined ? 50 : roleFilter.offset.count
      const offset_page = roleFilter.offset?.page == undefined ? 1 : roleFilter.offset.page

      let whereQuery = ''
      if (roleFilter?.filter) {
        whereQuery = generateWhereQuery(roleFilter?.filter)
      }
      let sortQuery = ''
      if (roleFilter?.sorts) {
        sortQuery = generateSortQuery(roleFilter?.sorts)
      }

      const result = await this.sequelize.query<Role>(
        `
          SELECT * FROM
          (
            SELECT
              "role_id",
              "role_name",
              "createdAt",
              "updatedAt"
            FROM
              "Roles" AS "Role"
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

  async findOne(role_id: number): Promise<boolean> {
    try {
      const foundRole = await this.roleRepository.findOne({
        where: { role_id },
      })

      if (foundRole) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatedRole: UpdateRoleDto, user_id: number) {
    try {
      await this.roleRepository.update({ ...updatedRole }, { where: { role_id: updatedRole.role_id } })

      const foundRole = await this.roleRepository.findOne({
        where: { role_id: updatedRole.role_id },
      })

      if (foundRole) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ROLE_UPDATED}${foundRole.role_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundRole
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(role_id: number, user_id: number) {
    try {
      const deleteRole = await this.roleRepository.destroy({
        where: { role_id },
      })

      if (deleteRole) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ROLE_DELETED}${role_id}`,
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
