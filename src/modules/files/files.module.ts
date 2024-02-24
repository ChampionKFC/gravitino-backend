import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { FileTypeModule } from '../file_type/file_type.module'
import { OrderModule } from '../order/order.module'
import { File } from './entities/file.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    SequelizeModule.forFeature([File]),
    FileTypeModule,
    OrderModule,
    TransactionHistoryModule,
    UsersModule,
    // SeederModule.forFeature([FileSeeds]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
