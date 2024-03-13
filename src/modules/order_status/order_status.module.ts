import { Module } from '@nestjs/common'
import { OrderStatusService } from './order_status.service'
import { OrderStatusController } from './order_status.controller'
import { OrderStatus } from './entities/order_status.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'
import { User } from '../users/entities/user.entity'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { PermissionsService } from '../permissions/permissions.service'

@Module({
  imports: [SequelizeModule.forFeature([OrderStatus, User, RolePermission, Permission]), TransactionHistoryModule, UsersModule],
  controllers: [OrderStatusController],
  providers: [OrderStatusService, RolesPermissionsService, PermissionsService],
  exports: [OrderStatusService],
})
export class OrderStatusModule {}
