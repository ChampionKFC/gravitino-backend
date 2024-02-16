import { Module } from '@nestjs/common'
import { BranchService } from './branch.service'
import { BranchController } from './branch.controller'
import { Branch } from './entities/branch.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { OrganizationModule } from '../organization/organization.module'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { BranchSeeds } from './seeds'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationService } from '../organization/organization.service'
import { Person } from '../person/entities/person.entity'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Branch, User, Person, Organization]),
    OrganizationModule,
    TransactionHistoryModule,
    SeederModule.forFeature([BranchSeeds]),
  ],
  controllers: [BranchController],
  providers: [BranchService, UsersService, OrganizationService],
  exports: [BranchService],
})
export class BranchModule {}
