import { Module } from '@nestjs/common'
import { PropertyNamesService } from './property_names.service'
import { PropertyNamesController } from './property_names.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { PropertyName } from './entities/property_name.entity'
import { PropertyNameSeeds } from './seeds'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { PropertyValuesService } from '../property_values/property_values.service'
import { PropertyValue } from '../property_values/entities/property_value.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [SequelizeModule.forFeature([PropertyName, PropertyValue]), TransactionHistoryModule, UsersModule, SeederModule.forFeature([PropertyNameSeeds])],
  controllers: [PropertyNamesController],
  providers: [PropertyNamesService, PropertyValuesService],
  exports: [PropertyNamesService],
})
export class PropertyNamesModule {}
