import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileType } from 'src/modules/file_type/entities/file_type.entity';
import { Report } from './entities/report.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { TransactionHistory } from '../transaction_history/entities/transaction_history.entity';
import { TransactionHistoryService } from '../transaction_history/transaction_history.service';
import { ReportSeeds } from './seeds';
import { SeederModule } from 'nestjs-sequelize-seeder';

@Module({
  imports: [
    SequelizeModule.forFeature([Report, FileType, User, TransactionHistory]),
    SeederModule.forFeature([ReportSeeds]),
  ],
  controllers: [ReportController],
  providers: [ReportService, TransactionHistoryService],
})
export class ReportModule {}
