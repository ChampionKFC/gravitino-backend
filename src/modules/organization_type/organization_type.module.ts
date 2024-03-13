import { Module } from '@nestjs/common'
import { OrganizationTypeService } from './organization_type.service'
import { OrganizationTypeController } from './organization_type.controller'
import { OrganizationType } from './entities/organization_type.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationService } from '../organization/organization.service'
import { Person } from '../person/entities/person.entity'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { PermissionsService } from '../permissions/permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { Facility } from '../facility/entities/facility.entity'
import { FacilityService } from '../facility/facility.service'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { BranchService } from '../branch/branch.service'
import { FacilityTypeService } from '../facility_type/facility_type.service'
import { GuestService } from '../guest/guest.service'
import { MailService } from '../mail/mail.service'
import { OrderService } from '../order/order.service'
import { OrderJournalService } from '../order_journal/order_journal.service'
import { ReportService } from '../report/report.service'
import { Branch } from '../branch/entities/branch.entity'
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity'
import { FacilityType } from '../facility_type/entities/facility_type.entity'
import { Guest } from '../guest/entities/guest.entity'
import { Order } from '../order/entities/order.entity'
import { OrderJournal } from '../order_journal/entities/order_journal.entity'
import { File } from '../files/entities/file.entity'
import { HttpModule } from '@nestjs/axios'
import { CheckpointTypeService } from '../checkpoint_type/checkpoint_type.service'
import { NeighboringStateService } from '../neighboring_state/neighboring_state.service'
import { OperatingModeService } from '../operating_mode/operating_mode.service'
import { WorkingHoursService } from '../working_hours/working_hours.service'
import { CheckpointType } from '../checkpoint_type/entities/checkpoint_type.entity'
import { NeighboringState } from '../neighboring_state/entities/neighboring_state.entity'
import { OperatingMode } from '../operating_mode/entities/operating_mode.entity'
import { WorkingHours } from '../working_hours/entities/working_hour.entity'
import { OrderPriority } from '../priority/entities/priority.entity'
import { PriorityService } from '../priority/priority.service'
import { RolesService } from '../roles/roles.service'
import { Role } from '../roles/entities/role.entity'
import { Group } from '../group/entities/group.entity'
import { GroupService } from '../group/group.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      OrganizationType,
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
      Branch,
      OrderJournal,
      NeighboringState,
      CheckpointType,
      OperatingMode,
      WorkingHours,
      OrderPriority,
      Role,
      Group,
    ]),
    TransactionHistoryModule,
    HttpModule,
  ],
  controllers: [OrganizationTypeController],
  providers: [
    OrganizationTypeService,
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
    PriorityService,
    RolesService,
    GroupService,
  ],
  exports: [OrganizationTypeService],
})
export class OrganizationTypeModule {}
