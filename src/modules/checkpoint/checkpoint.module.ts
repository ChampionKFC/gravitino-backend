import { Module } from '@nestjs/common'
import { CheckpointService } from './checkpoint.service'
import { CheckpointController } from './checkpoint.controller'
import { Checkpoint } from './entities/checkpoint.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { BranchModule } from '../branch/branch.module'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from '../users/users.module'
import { ReportService } from '../report/report.service'
import { Report } from '../report/entities/report.entity'
import { OrderService } from '../order/order.service'
import { Order } from '../order/entities/order.entity'
import { Organization } from '../organization/entities/organization.entity'
import { OrderJournalService } from '../order_journal/order_journal.service'
import { OrganizationService } from '../organization/organization.service'
import { OrderJournal } from '../order_journal/entities/order_journal.entity'
import { FilesService } from '../files/files.service'
import { File } from '../files/entities/file.entity'
import { GuestModule } from '../guest/guest.module'
import { MailModule } from '../mail/mail.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { PermissionsService } from '../permissions/permissions.service'
import { Permission } from '../permissions/entities/permission.entity'
import { FacilityModule } from '../facility/facility.module'
import { CheckpointTypeService } from '../checkpoint_type/checkpoint_type.service'
import { CheckpointType } from '../checkpoint_type/entities/checkpoint_type.entity'
import { NeighboringState } from '../neighboring_state/entities/neighboring_state.entity'
import { NeighboringStateService } from '../neighboring_state/neighboring_state.service'
import { OperatingMode } from '../operating_mode/entities/operating_mode.entity'
import { OperatingModeService } from '../operating_mode/operating_mode.service'
import { WorkingHours } from '../working_hours/entities/working_hour.entity'
import { WorkingHoursService } from '../working_hours/working_hours.service'
import { PriorityService } from '../priority/priority.service'
import { OrderPriority } from '../priority/entities/priority.entity'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Checkpoint,
      Report,
      Order,
      File,
      Organization,
      OrderJournal,
      RolePermission,
      Permission,
      NeighboringState,
      CheckpointType,
      OperatingMode,
      WorkingHours,
      OrderPriority,
    ]),
    BranchModule,
    UsersModule,
    TransactionHistoryModule,
    HttpModule,
    GuestModule,
    MailModule,
    FacilityModule,
  ],
  controllers: [CheckpointController],
  providers: [
    CheckpointService,
    OrderService,
    OrderJournalService,
    OrganizationService,
    ReportService,
    FilesService,
    RolesPermissionsService,
    PermissionsService,
    NeighboringStateService,
    CheckpointTypeService,
    OperatingModeService,
    WorkingHoursService,
    PriorityService,
  ],
  exports: [CheckpointService],
})
export class CheckpointModule {}
