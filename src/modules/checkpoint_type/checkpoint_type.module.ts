import { Module } from '@nestjs/common';
import { CheckpointTypeService } from './checkpoint_type.service';
import { CheckpointTypeController } from './checkpoint_type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CheckpointType } from './entities/checkpoint_type.entity';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { CheckpointTypeSeeds } from './seeds';
import { SeederModule } from 'nestjs-sequelize-seeder';

@Module({
  imports: [
    SequelizeModule.forFeature([CheckpointType]), TransactionHistoryModule,
    SeederModule.forFeature([CheckpointTypeSeeds]),
  ],
  controllers: [CheckpointTypeController],
  providers: [CheckpointTypeService],
  exports: [CheckpointTypeService],
})
export class CheckpointTypeModule { }
