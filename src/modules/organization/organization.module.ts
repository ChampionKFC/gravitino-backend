import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { OrganizationTypeModule } from '../organization_type/organization_type.module';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { OrganizationSeeds } from './seeds';

@Module({
  imports: [
    SequelizeModule.forFeature([Organization]),
    TransactionHistoryModule,
    OrganizationTypeModule,
    SeederModule.forFeature([OrganizationSeeds]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
