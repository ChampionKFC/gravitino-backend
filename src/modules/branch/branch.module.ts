import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { Branch } from './entities/branch.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrganizationModule } from '../organization/organization.module';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { BranchSeeds } from './seeds';

@Module({
  imports: [
    SequelizeModule.forFeature([Branch]),
    OrganizationModule,
    TransactionHistoryModule,
    SeederModule.forFeature([BranchSeeds]),
  ],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
