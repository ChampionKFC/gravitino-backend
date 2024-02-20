import { Module } from '@nestjs/common'
import { ReportService } from './report.service'
import { ReportController } from './report.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileType } from 'src/modules/file_type/entities/file_type.entity'
import { Report } from './entities/report.entity'
import { TransactionHistory } from '../transaction_history/entities/transaction_history.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { OrderModule } from '../order/order.module'
import { BranchModule } from '../branch/branch.module'
import { UsersModule } from '../users/users.module'
import { CheckpointModule } from '../checkpoint/checkpoint.module'

@Module({
  imports: [SequelizeModule.forFeature([Report, FileType, TransactionHistory]), BranchModule, CheckpointModule, UsersModule, OrderModule],
  controllers: [ReportController],
  providers: [ReportService, TransactionHistoryService],
})
export class ReportModule {}
