import { Module } from '@nestjs/common'
import { NeighboringStateService } from './neighboring_state.service'
import { NeighboringStateController } from './neighboring_state.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { NeighboringState } from './entities/neighboring_state.entity'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { NeighboringStateSeeds } from './seeds'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [SequelizeModule.forFeature([NeighboringState]), TransactionHistoryModule, UsersModule, SeederModule.forFeature([NeighboringStateSeeds])],
  controllers: [NeighboringStateController],
  providers: [NeighboringStateService],
  exports: [NeighboringStateService],
})
export class NeighboringStateModule {}
