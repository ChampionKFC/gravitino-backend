import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { Role } from './entities/role.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { Person } from '../person/entities/person.entity'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationService } from '../organization/organization.service'
import { PermissionsService } from '../permissions/permissions.service'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { Facility } from '../facility/entities/facility.entity'
import { FacilityService } from '../facility/facility.service'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { FacilityTypeService } from '../facility_type/facility_type.service'
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity'
import { ReportService } from '../report/report.service'
import { HttpModule } from '@nestjs/axios'
import { FacilityType } from '../facility_type/entities/facility_type.entity'
import { OrderService } from '../order/order.service'
import { BranchService } from '../branch/branch.service'
import { Order } from '../order/entities/order.entity'
import { File } from '../files/entities/file.entity'
import { GuestService } from '../guest/guest.service'
import { OrderJournalService } from '../order_journal/order_journal.service'
import { MailService } from '../mail/mail.service'
import { Branch } from '../branch/entities/branch.entity'
import { Guest } from '../guest/entities/guest.entity'
import { OrderJournal } from '../order_journal/entities/order_journal.entity'
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
import { GroupService } from '../group/group.service'
import { Group } from '../group/entities/group.entity'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Role,
      User,
      Person,
      Organization,
      RolePermission,
      Permission,
      Facility,
      Checkpoint,
      FacilityType,
      Order,
      File,
      Branch,
      Guest,
      OrderJournal,
      NeighboringState,
      CheckpointType,
      OperatingMode,
      WorkingHours,
      OrderPriority,
      Group,
    ]),
    TransactionHistoryModule,
    HttpModule,
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    UsersService,
    OrganizationService,
    RolesPermissionsService,
    PermissionsService,
    FacilityService,
    CheckpointService,
    FacilityTypeService,
    ReportService,
    OrderService,
    BranchService,
    GuestService,
    OrderJournalService,
    MailService,
    NeighboringStateService,
    CheckpointTypeService,
    OperatingModeService,
    WorkingHoursService,
    GroupService,
    PriorityService,
  ],
  exports: [RolesService],
})
export class RolesModule {}
