import { Module } from '@nestjs/common'
import { PriorityService } from './priority.service'
import { PriorityController } from './priority.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { OrderPriority } from './entities/priority.entity'
import { UsersModule } from '../users/users.module'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { PermissionsService } from '../permissions/permissions.service'
import { Permission } from '../permissions/entities/permission.entity'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'

@Module({
  imports: [SequelizeModule.forFeature([OrderPriority, RolePermission, Permission]), UsersModule, TransactionHistoryModule],
  controllers: [PriorityController],
  providers: [PriorityService, RolesPermissionsService, PermissionsService],
  exports: [PriorityService],
})
export class PriorityModule {}
