import { Module } from '@nestjs/common'
import { TransactionHistoryService } from './transaction_history.service'
import { TransactionHistoryController } from './transaction_history.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from 'src/modules/users/entities/user.entity'
import { TransactionHistory } from './entities/transaction_history.entity'
import { UsersService } from '../users/users.service'
import { Person } from '../person/entities/person.entity'
import { Role } from '../roles/entities/role.entity'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Group } from '../group/entities/group.entity'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationService } from '../organization/organization.service'
import { FacilityService } from '../facility/facility.service'
import { Facility } from '../facility/entities/facility.entity'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { FacilityTypeService } from '../facility_type/facility_type.service'
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity'
import { ReportService } from '../report/report.service'
import { HttpModule } from '@nestjs/axios'
import { FacilityType } from '../facility_type/entities/facility_type.entity'
import { OrderService } from '../order/order.service'
import { BranchService } from '../branch/branch.service'
import { Order } from '../order/entities/order.entity'
import { Guest } from '../guest/entities/guest.entity'
import { GuestService } from '../guest/guest.service'
import { OrderJournalService } from '../order_journal/order_journal.service'
import { MailService } from '../mail/mail.service'
import { Branch } from '../branch/entities/branch.entity'
import { OrderJournal } from '../order_journal/entities/order_journal.entity'
import { NeighboringStateService } from '../neighboring_state/neighboring_state.service'
import { CheckpointTypeService } from '../checkpoint_type/checkpoint_type.service'
import { OperatingModeService } from '../operating_mode/operating_mode.service'
import { WorkingHoursService } from '../working_hours/working_hours.service'
import { NeighboringState } from '../neighboring_state/entities/neighboring_state.entity'
import { CheckpointType } from '../checkpoint_type/entities/checkpoint_type.entity'
import { OperatingMode } from '../operating_mode/entities/operating_mode.entity'
import { WorkingHours } from '../working_hours/entities/working_hour.entity'
import { PriorityService } from '../priority/priority.service'
import { OrderPriority } from '../priority/entities/priority.entity'
import { RolesService } from '../roles/roles.service'
import { GroupService } from '../group/group.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      TransactionHistory,
      User,
      Person,
      Role,
      RolePermission,
      Group,
      Organization,
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
    ]),
    HttpModule,
  ],
  controllers: [TransactionHistoryController],
  providers: [
    TransactionHistoryService,
    UsersService,
    OrganizationService,
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
  exports: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
