import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Permission } from './entities/permission.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'

@Module({
  imports: [SequelizeModule.forFeature([Permission, RolePermission]), TransactionHistoryModule, UsersModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, RolesPermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
