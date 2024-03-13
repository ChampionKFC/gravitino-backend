import { Module } from '@nestjs/common'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Group } from './entities/group.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { BranchModule } from '../branch/branch.module'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationService } from '../organization/organization.service'
import { Person } from '../person/entities/person.entity'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { PermissionsService } from '../permissions/permissions.service'
import { Facility } from '../facility/entities/facility.entity'
import { FacilityService } from '../facility/facility.service'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { FacilityTypeService } from '../facility_type/facility_type.service'
import { GuestService } from '../guest/guest.service'
import { MailService } from '../mail/mail.service'
import { OrderService } from '../order/order.service'
import { OrderJournalService } from '../order_journal/order_journal.service'
import { ReportService } from '../report/report.service'
import { File } from '../files/entities/file.entity'
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity'
import { FacilityType } from '../facility_type/entities/facility_type.entity'
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
import { PriorityService } from '../priority/priority.service'
import { OrderPriority } from '../priority/entities/priority.entity'
import { Role } from '../roles/entities/role.entity'
import { RolesService } from '../roles/roles.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Group,
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
      Guest,
      OrderJournal,
      NeighboringState,
      CheckpointType,
      OperatingMode,
      WorkingHours,
      OrderPriority,
      Role,
    ]),
    TransactionHistoryModule,
    BranchModule,
    HttpModule,
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    UsersService,
    OrganizationService,
    RolesPermissionsService,
    PermissionsService,
    FacilityService,
    CheckpointService,
    FacilityTypeService,
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
    RolesService,
  ],
  exports: [GroupService],
})
export class GroupModule {}
