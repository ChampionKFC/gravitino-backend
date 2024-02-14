import { Module } from '@nestjs/common'
import { FacilityService } from './facility.service'
import { FacilityController } from './facility.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Facility } from './entities/facility.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { CheckpointModule } from '../checkpoint/checkpoint.module'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { OrganizationModule } from '../organization/organization.module'
import { FacilitySeeds } from './seeds'
import { BranchModule } from '../branch/branch.module'
import { FacilityTypeModule } from '../facility_type/facility_type.module'

@Module({
  imports: [
    SequelizeModule.forFeature([Facility]),
    CheckpointModule,
    OrganizationModule,
    TransactionHistoryModule,
    BranchModule,
    FacilityTypeModule,
    SeederModule.forFeature([FacilitySeeds]),
  ],
  controllers: [FacilityController],
  providers: [FacilityService],
  exports: [FacilityService],
})
export class FacilityModule {}
