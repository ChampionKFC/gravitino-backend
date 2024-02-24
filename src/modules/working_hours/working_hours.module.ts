import { Module } from '@nestjs/common'
import { WorkingHoursService } from './working_hours.service'
import { WorkingHoursController } from './working_hours.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { WorkingHours } from './entities/working_hour.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { WorkingHoursSeeds } from './seeds'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [SequelizeModule.forFeature([WorkingHours]), TransactionHistoryModule, UsersModule, SeederModule.forFeature([WorkingHoursSeeds])],
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService],
  exports: [WorkingHoursService],
})
export class WorkingHoursModule {}
