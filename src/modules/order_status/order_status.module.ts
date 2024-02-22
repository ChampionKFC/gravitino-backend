import { Module } from '@nestjs/common'
import { OrderStatusService } from './order_status.service'
import { OrderStatusController } from './order_status.controller'
import { OrderStatus } from './entities/order_status.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { OrderStatusSeeds } from './seeds'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { UsersModule } from '../users/users.module'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [SequelizeModule.forFeature([OrderStatus, User]), TransactionHistoryModule, UsersModule, SeederModule.forFeature([OrderStatusSeeds])],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
  exports: [OrderStatusService],
})
export class OrderStatusModule {}
