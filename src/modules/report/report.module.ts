import { Module } from '@nestjs/common'
import { ReportService } from './report.service'
import { ReportController } from './report.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileType } from 'src/modules/file_type/entities/file_type.entity'
import { Report } from './entities/report.entity'
import { TransactionHistory } from '../transaction_history/entities/transaction_history.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { OrderModule } from '../order/order.module'
import { BranchModule } from '../branch/branch.module'
import { UsersModule } from '../users/users.module'
import { FacilityModule } from '../facility/facility.module'
import { CheckpointModule } from '../checkpoint/checkpoint.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { PermissionsService } from '../permissions/permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { OrganizationModule } from '../organization/organization.module'
@Module({
  imports: [
    SequelizeModule.forFeature([Report, FileType, TransactionHistory, File, RolePermission, Permission]),
    BranchModule,
    FacilityModule,
    UsersModule,
    OrderModule,
    CheckpointModule,
    OrganizationModule,
  ],
  controllers: [ReportController],
  providers: [ReportService, TransactionHistoryService, RolesPermissionsService, PermissionsService],
  exports: [ReportService],
})
export class ReportModule {}
