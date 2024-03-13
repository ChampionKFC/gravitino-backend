import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Task } from './entities/task.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { CategoryModule } from '../category/category.module'
import { PeriodicityModule } from '../periodicity/periodicity.module'
import { BranchModule } from '../branch/branch.module'
import { OrganizationModule } from '../organization/organization.module'
import { CheckpointModule } from '../checkpoint/checkpoint.module'
import { FacilityModule } from '../facility/facility.module'
import { Order } from '../order/entities/order.entity'
import { OrderService } from '../order/order.service'
import { User } from '../users/entities/user.entity'
import { OrderJournalModule } from '../order_journal/order_journal.module'
import { File } from '../files/entities/file.entity'
import { FacilityTypeModule } from '../facility_type/facility_type.module'
import { UsersModule } from '../users/users.module'
import { Organization } from '../organization/entities/organization.entity'
import { GuestModule } from '../guest/guest.module'
import { MailModule } from '../mail/mail.module'
import { PermissionsService } from '../permissions/permissions.service'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { PriorityService } from '../priority/priority.service'
import { OrderPriority } from '../priority/entities/priority.entity'

@Module({
  imports: [
    SequelizeModule.forFeature([Task, Order, User, File, Organization, RolePermission, Permission, OrderPriority]),
    CategoryModule,
    PeriodicityModule,
    TransactionHistoryModule,
    BranchModule,
    OrganizationModule,
    CheckpointModule,
    FacilityModule,
    OrderJournalModule,
    FacilityTypeModule,
    UsersModule,
    GuestModule,
    MailModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, OrderService, RolesPermissionsService, PermissionsService, PriorityService],
  exports: [TaskService],
})
export class TaskModule {}
