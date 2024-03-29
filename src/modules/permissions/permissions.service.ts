import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreatePermissionDto, UpdatePermissionDto } from './dto'
import { Permission } from './entities/permission.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayPermissionResponse, PermissionResponse, StatusPermissionResponse } from './response'
import { AppStrings } from 'src/common/constants/strings'
import { AppError } from 'src/common/constants/error'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission) private permissionRepository: typeof Permission,
    private readonly historyService: TransactionHistoryService,
  ) {}

  async create(permission: CreatePermissionDto, user_id: number): Promise<PermissionResponse> {
    try {
      const newPermission = await this.permissionRepository.create({
        ...permission,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_PERMISSION_CREATED}${newPermission.permission_id}`,
      }
      await this.historyService.create(historyDto)

      return newPermission
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(): Promise<ArrayPermissionResponse> {
    try {
      const result = await this.permissionRepository.findAll()
      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(permission_id: number): Promise<boolean> {
    try {
      const foundPermission = await this.permissionRepository.findOne({
        where: { permission_id },
      })

      if (foundPermission) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findBySku(permission_sku: string): Promise<PermissionResponse> {
    try {
      const foundPermission = await this.permissionRepository.findOne({
        where: { permission_sku },
      })

      if (foundPermission) {
        return foundPermission
      } else {
        throw new HttpException(AppError.PERMISSION_NOT_FOUND, HttpStatus.NOT_FOUND)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatedPermission: UpdatePermissionDto, user_id: number): Promise<PermissionResponse> {
    try {
      await this.permissionRepository.update({ ...updatedPermission }, { where: { permission_id: updatedPermission.permission_id } })

      const foundPermission = await this.permissionRepository.findOne({
        where: { permission_id: updatedPermission.permission_id },
      })

      if (foundPermission) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_PERMISSION_UPDATED}${foundPermission.permission_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundPermission
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(permission_id: number, user_id: number): Promise<StatusPermissionResponse> {
    try {
      const deletePermission = await this.permissionRepository.destroy({
        where: { permission_id },
      })

      if (deletePermission) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_PERMISSION_DELETED}${permission_id}`,
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
