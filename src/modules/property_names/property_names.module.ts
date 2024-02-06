import { Module } from '@nestjs/common';
import { PropertyNamesService } from './property_names.service';
import { PropertyNamesController } from './property_names.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { PropertyName } from './entities/property_name.entity';
import { PropertyNameSeeds } from './seeds';
import { SeederModule } from 'nestjs-sequelize-seeder';

@Module({
  imports: [
    SequelizeModule.forFeature([PropertyName]),
    TransactionHistoryModule,
    SeederModule.forFeature([PropertyNameSeeds]),
  ],
  controllers: [PropertyNamesController],
  providers: [PropertyNamesService],
  exports: [PropertyNamesService],
})
export class PropertyNamesModule {}
