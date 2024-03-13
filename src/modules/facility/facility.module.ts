import { Module } from '@nestjs/common'
import { FacilityService } from './facility.service'
import { FacilityController } from './facility.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Facility } from './entities/facility.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { OrganizationModule } from '../organization/organization.module'
import { BranchModule } from '../branch/branch.module'
import { FacilityTypeModule } from '../facility_type/facility_type.module'
import { UsersModule } from '../users/users.module'
import { Organization } from '../organization/entities/organization.entity'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { PermissionsService } from '../permissions/permissions.service'
import { Permission } from '../permissions/entities/permission.entity'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { GuestService } from '../guest/guest.service'
import { MailService } from '../mail/mail.service'
import { OrderService } from '../order/order.service'
import { OrderJournalService } from '../order_journal/order_journal.service'
import { ReportService } from '../report/report.service'
import { File } from '../files/entities/file.entity'
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity'
import { Guest } from '../guest/entities/guest.entity'
import { Order } from '../order/entities/order.entity'
import { OrderJournal } from '../order_journal/entities/order_journal.entity'
import { HttpModule } from '@nestjs/axios'
import { CheckpointTypeService } from '../checkpoint_type/checkpoint_type.service'
import { CheckpointType } from '../checkpoint_type/entities/checkpoint_type.entity'
import { NeighboringState } from '../neighboring_state/entities/neighboring_state.entity'
import { NeighboringStateService } from '../neighboring_state/neighboring_state.service'
import { OperatingMode } from '../operating_mode/entities/operating_mode.entity'
import { OperatingModeService } from '../operating_mode/operating_mode.service'
import { WorkingHours } from '../working_hours/entities/working_hour.entity'
import { WorkingHoursService } from '../working_hours/working_hours.service'
import { OrderPriority } from '../priority/entities/priority.entity'
import { PriorityService } from '../priority/priority.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Facility,
      Organization,
      RolePermission,
      Permission,
      Checkpoint,
      Order,
      File,
      Guest,
      OrderJournal,
      NeighboringState,
      CheckpointType,
      OperatingMode,
      WorkingHours,
      OrderPriority,
    ]),
    OrganizationModule,
    TransactionHistoryModule,
    BranchModule,
    FacilityTypeModule,
    UsersModule,
    HttpModule,
  ],
  controllers: [FacilityController],
  providers: [
    FacilityService,
    RolesPermissionsService,
    PermissionsService,
    CheckpointService,
    ReportService,
    OrderService,
    GuestService,
    OrderJournalService,
    MailService,
    NeighboringStateService,
    CheckpointTypeService,
    OperatingModeService,
    WorkingHoursService,
    PriorityService,
  ],
  exports: [FacilityService],
})
export class FacilityModule {}
