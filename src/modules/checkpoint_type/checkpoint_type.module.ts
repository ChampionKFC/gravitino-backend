import { Module } from '@nestjs/common'
import { CheckpointTypeService } from './checkpoint_type.service'
import { CheckpointTypeController } from './checkpoint_type.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { CheckpointType } from './entities/checkpoint_type.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { PermissionsService } from '../permissions/permissions.service'
import { Permission } from '../permissions/entities/permission.entity'

@Module({
  imports: [SequelizeModule.forFeature([CheckpointType, RolePermission, Permission]), TransactionHistoryModule, UsersModule],
  controllers: [CheckpointTypeController],
  providers: [CheckpointTypeService, RolesPermissionsService, PermissionsService],
  exports: [CheckpointTypeService],
})
export class CheckpointTypeModule {}
