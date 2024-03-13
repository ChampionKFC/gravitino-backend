import { Module } from '@nestjs/common'
import { FacilityTypeService } from './facility_type.service'
import { FacilityTypeController } from './facility_type.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { FacilityType } from './entities/facility_type.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { PermissionsService } from '../permissions/permissions.service'
import { Permission } from '../permissions/entities/permission.entity'

@Module({
  imports: [SequelizeModule.forFeature([FacilityType, RolePermission, Permission]), UsersModule, TransactionHistoryModule],
  controllers: [FacilityTypeController],
  providers: [FacilityTypeService, RolesPermissionsService, PermissionsService],
  exports: [FacilityTypeService],
})
export class FacilityTypeModule {}
