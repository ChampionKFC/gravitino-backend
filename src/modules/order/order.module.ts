import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Order } from './entities/order.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { TaskModule } from '../task/task.module'
import { OrganizationModule } from '../organization/organization.module'
import { UsersModule } from '../users/users.module'
import { OrderStatusModule } from '../order_status/order_status.module'
import { PriorityModule } from '../priority/priority.module'
import { CheckpointModule } from '../checkpoint/checkpoint.module'
import { User } from '../users/entities/user.entity'
import { FacilityModule } from '../facility/facility.module'
import { BranchModule } from '../branch/branch.module'
import { OrderJournalModule } from '../order_journal/order_journal.module'
import { File } from '../files/entities/file.entity'
import { Organization } from '../organization/entities/organization.entity'
import { FacilityTypeModule } from '../facility_type/facility_type.module'
import { GuestModule } from '../guest/guest.module'
import { MailModule } from '../mail/mail.module'
import { PermissionsService } from '../permissions/permissions.service'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { Permission } from '../permissions/entities/permission.entity'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'

@Module({
  imports: [
    SequelizeModule.forFeature([Order, User, File, Organization, RolePermission, Permission]),
    TaskModule,
    CheckpointModule,
    FacilityModule,
    BranchModule,
    OrganizationModule,
    UsersModule,
    OrderStatusModule,
    PriorityModule,
    TransactionHistoryModule,
    OrderJournalModule,
    FacilityTypeModule,
    GuestModule,
    MailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, RolesPermissionsService, PermissionsService],
  exports: [OrderService],
})
export class OrderModule {}
