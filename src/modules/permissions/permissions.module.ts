import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Permission } from './entities/permission.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { PermissionSeeds } from './seeds'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [SequelizeModule.forFeature([Permission]), TransactionHistoryModule, UsersModule, SeederModule.forFeature([PermissionSeeds])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
