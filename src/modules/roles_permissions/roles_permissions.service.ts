import { Injectable } from '@nestjs/common'
import { CreateRolesPermissionDto, UpdateRolesPermissionDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { RolePermission } from './entities/roles_permission.entity'
import { RolePermissionResponse, StatusRolePermissionResponse } from './response'
import { UsersService } from '../users/users.service'
import { PermissionsService } from '../permissions/permissions.service'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class RolesPermissionsService {
  constructor(
    @InjectModel(RolePermission)
    private rolePermissionRepository: typeof RolePermission,
    private readonly historyService: TransactionHistoryService,
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async create(rolePermission: CreateRolesPermissionDto, user_id: number): Promise<StatusRolePermissionResponse> {
    try {
      const newRolePermission = await this.rolePermissionRepository.create({
        ...rolePermission,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_ROLES_PERMISSIONS_CREATED}${newRolePermission.permission_id} ${AppStrings.HISTORY_ROLES_PERMISSIONS_VALUE} ${newRolePermission.rights} ${AppStrings.HISTORY_ROLES_PERMISSIONS_ROLE}${newRolePermission.role_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newRolePermission }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(): Promise<ArrayRolePermissionResponse> {
    try {
      const result = await this.rolePermissionRepository.findAll()
      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(id: number): Promise<boolean> {
    const foundRolePermission = await this.rolePermissionRepository.findOne({
      where: { role_permission_id: id },
    })

    if (foundRolePermission) {
      return true
    } else {
      return false
    }
  }

  async update(updatedRolePermission: UpdateRolesPermissionDto, user_id: number): Promise<RolePermissionResponse> {
    try {
      await this.rolePermissionRepository.update(
        { ...updatedRolePermission },
        {
          where: {
            role_permission_id: updatedRolePermission.role_permission_id,
          },
        },
      )

      const foundRolePermission = await this.rolePermissionRepository.findOne({
        where: { role_permission_id: updatedRolePermission.role_permission_id },
      })

      if (foundRolePermission) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ROLES_PERMISSIONS_UPDATED}${foundRolePermission.permission_id} ${AppStrings.HISTORY_ROLES_PERMISSIONS_VALUE} ${foundRolePermission.rights} ${AppStrings.HISTORY_ROLES_PERMISSIONS_ROLE}${foundRolePermission.role_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundRolePermission
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(role_permission_id: number, user_id: number): Promise<StatusRolePermissionResponse> {
    try {
      const deleteRolePermission = await this.rolePermissionRepository.destroy({
        where: { role_permission_id },
      })

      if (deleteRolePermission) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_ROLES_PERMISSIONS_DELETED}${role_permission_id}`,
        }
        await this.historyService.create(historyDto)

        return { status: true }
      }

      return { status: false }
    } catch (error) {
      throw new Error(error)
    }
  }

  async checkPermission(permission_sku: string, user_id: number): Promise<boolean> {
    const user = await this.usersService.findById(user_id)

    if (!user) {
      return false
    }

    const permission = await this.permissionsService.findBySku(permission_sku)
    if (!permission) {
      return false
    }
    console.log(user.user_id)
    console.log(user_id)

    const rolePermission = await this.rolePermissionRepository.findOne({
      where: {
        permission_id: permission.permission_id,
        role_id: user.role.role_id,
      },
    })
    const userPermission = await this.rolePermissionRepository.findOne({
      where: { permission_id: permission.permission_id, user_id: user.user_id },
    })

    if (!rolePermission || !rolePermission.rights) {
      console.log(rolePermission)
      console.log(userPermission)

      if (!userPermission || !userPermission.rights) {
        return false
      } else {
        return true
      }
    } else {
      if (!userPermission) {
        return true
      } else if (!userPermission.rights) {
        return false
      } else {
        return true
      }
    }
  }
}
