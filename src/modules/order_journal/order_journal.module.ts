import { Module } from '@nestjs/common';
import { OrderJournalService } from './order_journal.service';
import { OrderJournalController } from './order_journal.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderJournal } from './entities/order_journal.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([OrderJournal]), UsersModule],
  controllers: [OrderJournalController],
  providers: [OrderJournalService],
  exports: [OrderJournalService],
})
export class OrderJournalModule {}
