import { Module } from '@nestjs/common';
import { PropertyValuesService } from './property_values.service';
import { PropertyValuesController } from './property_values.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertyValue } from './entities/property_value.entity';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { PropertyNamesModule } from '../property_names/property_names.module';

@Module({
  imports: [
    SequelizeModule.forFeature([PropertyValue]),
    PropertyNamesModule,
    TransactionHistoryModule,
    //SeederModule.forFeature([PropertyValueSeeds]),
  ],
  controllers: [PropertyValuesController],
  providers: [PropertyValuesService],
  exports: [PropertyValuesService],
})
export class PropertyValuesModule {}
