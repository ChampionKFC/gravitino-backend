import { Module } from '@nestjs/common'
import { OperatingModeService } from './operating_mode.service'
import { OperatingModeController } from './operating_mode.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { OperatingMode } from './entities/operating_mode.entity'
import { OperatingModeSeeds } from './seeds'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'

@Module({
  imports: [SequelizeModule.forFeature([OperatingMode]), TransactionHistoryModule, SeederModule.forFeature([OperatingModeSeeds])],
  controllers: [OperatingModeController],
  providers: [OperatingModeService],
  exports: [OperatingModeService],
})
export class OperatingModeModule {}
