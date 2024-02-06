import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { TaskModule } from '../task/task.module';
import { OrganizationModule } from '../organization/organization.module';
import { UsersModule } from '../users/users.module';
import { OrderStatusModule } from '../order_status/order_status.module';
import { PriorityModule } from '../priority/priority.module';
import { OrderSeeds } from './seeds';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { CheckpointModule } from '../checkpoint/checkpoint.module';
import { User } from '../users/entities/user.entity';
import { FacilityModule } from '../facility/facility.module';
import { BranchModule } from '../branch/branch.module';
import { OrderJournalModule } from '../order_journal/order_journal.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, User]),
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
    SeederModule.forFeature([OrderSeeds]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
