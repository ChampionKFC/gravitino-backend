import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { RolesPermissionsModule } from '../roles_permissions/roles_permissions.module';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { CategorySeeds } from './seeds';

@Module({
  imports: [
    SequelizeModule.forFeature([Category]),
    TransactionHistoryModule,
    RolesPermissionsModule,
    SeederModule.forFeature([CategorySeeds]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
