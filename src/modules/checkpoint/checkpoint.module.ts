import { Module } from '@nestjs/common'
import { CheckpointService } from './checkpoint.service'
import { CheckpointController } from './checkpoint.controller'
import { Checkpoint } from './entities/checkpoint.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { CheckpointSeeds } from './seeds'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { BranchModule } from '../branch/branch.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [SequelizeModule.forFeature([Checkpoint]), BranchModule, TransactionHistoryModule, HttpModule, SeederModule.forFeature([CheckpointSeeds])],
  controllers: [CheckpointController],
  providers: [CheckpointService],
  exports: [CheckpointService],
})
export class CheckpointModule {}
