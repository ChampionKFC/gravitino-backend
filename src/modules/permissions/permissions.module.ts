import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from './entities/permission.entity';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { PermissionSeeds } from './seeds';

@Module({
  imports: [
    SequelizeModule.forFeature([Permission]),
    TransactionHistoryModule,
    SeederModule.forFeature([PermissionSeeds]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
