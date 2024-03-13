import { Module } from '@nestjs/common'
import { NeighboringStateService } from './neighboring_state.service'
import { NeighboringStateController } from './neighboring_state.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { NeighboringState } from './entities/neighboring_state.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { PermissionsService } from '../permissions/permissions.service'

@Module({
  imports: [SequelizeModule.forFeature([NeighboringState, RolePermission, Permission]), TransactionHistoryModule, UsersModule],
  controllers: [NeighboringStateController],
  providers: [NeighboringStateService, RolesPermissionsService, PermissionsService],
  exports: [NeighboringStateService],
})
export class NeighboringStateModule {}
