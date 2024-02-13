import { Module } from '@nestjs/common'
import { FacilityTypeService } from './facility_type.service'
import { FacilityTypeController } from './facility_type.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { FacilityType } from './entities/facility_type.entity'
import { FacilityTypeSeeds } from './seeds'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'

@Module({
  imports: [SequelizeModule.forFeature([FacilityType]), TransactionHistoryModule, SeederModule.forFeature([FacilityTypeSeeds])],
  controllers: [FacilityTypeController],
  providers: [FacilityTypeService],
  exports: [FacilityTypeService],
})
export class FacilityTypeModule {}
