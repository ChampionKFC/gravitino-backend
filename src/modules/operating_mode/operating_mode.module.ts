import { Module } from '@nestjs/common'
import { OperatingModeService } from './operating_mode.service'
import { OperatingModeController } from './operating_mode.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { OperatingMode } from './entities/operating_mode.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { Permission } from '../permissions/entities/permission.entity'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { PermissionsService } from '../permissions/permissions.service'

@Module({
  imports: [SequelizeModule.forFeature([OperatingMode, RolePermission, Permission]), TransactionHistoryModule, UsersModule],
  controllers: [OperatingModeController],
  providers: [OperatingModeService, RolesPermissionsService, PermissionsService],
  exports: [OperatingModeService],
})
export class OperatingModeModule {}
