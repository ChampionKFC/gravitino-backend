import { Module } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { OrganizationController } from './organization.controller'
import { Organization } from './entities/organization.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { OrganizationTypeModule } from '../organization_type/organization_type.module'
import { FacilityService } from '../facility/facility.service'
import { Facility } from '../facility/entities/facility.entity'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { Person } from '../person/entities/person.entity'
import { MailService } from '../mail/mail.service'
import { BranchService } from '../branch/branch.service'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { FacilityTypeService } from '../facility_type/facility_type.service'
import { GuestService } from '../guest/guest.service'
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
import { Group } from '../group/entities/group.entity'
import { GroupService } from '../group/group.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Organization,
      Facility,
      User,
      Person,
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
      Role,
      Group,
    ]),
    TransactionHistoryModule,
    OrganizationTypeModule,
    HttpModule,
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    FacilityService,
    UsersService,
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
  exports: [OrganizationService],
})
export class OrganizationModule {}
