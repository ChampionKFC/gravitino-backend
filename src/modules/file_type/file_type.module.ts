import { Module } from '@nestjs/common';
import { FileTypeService } from './file_type.service';
import { FileTypeController } from './file_type.controller';
import { FileType } from './entities/file_type.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { FileTypeSeeds } from './seeds';

@Module({
  imports: [
    SequelizeModule.forFeature([FileType]),
    TransactionHistoryModule,
    SeederModule.forFeature([FileTypeSeeds]),
  ],
  controllers: [FileTypeController],
  providers: [FileTypeService],
  exports: [FileTypeService],
})
export class FileTypeModule {}
