import { Module } from '@nestjs/common'
import { WorkingHoursService } from './working_hours.service'
import { WorkingHoursController } from './working_hours.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { WorkingHours } from './entities/working_hour.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { PermissionsService } from '../permissions/permissions.service'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'

@Module({
  imports: [SequelizeModule.forFeature([WorkingHours, RolePermission, Permission]), TransactionHistoryModule, UsersModule],
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService, RolesPermissionsService, PermissionsService],
  exports: [WorkingHoursService],
})
export class WorkingHoursModule {}
