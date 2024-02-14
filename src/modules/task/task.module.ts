import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Task } from './entities/task.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { CategoryModule } from '../category/category.module'
import { TaskSeeds } from './seeds'
import { SeederModule } from 'nestjs-sequelize-seeder'
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

@Module({
  imports: [
    SequelizeModule.forFeature([Task, Order, User, File]),
    CategoryModule,
    PeriodicityModule,
    TransactionHistoryModule,
    BranchModule,
    OrganizationModule,
    CheckpointModule,
    FacilityModule,
    OrderJournalModule,
    FacilityTypeModule,
    SeederModule.forFeature([TaskSeeds]),
  ],
  controllers: [TaskController],
  providers: [TaskService, OrderService],
  exports: [TaskService],
})
export class TaskModule {}
