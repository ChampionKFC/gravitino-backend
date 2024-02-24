import { Module } from '@nestjs/common'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Group } from './entities/group.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { GroupSeeds } from './seeds'
import { BranchModule } from '../branch/branch.module'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationService } from '../organization/organization.service'
import { Person } from '../person/entities/person.entity'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'

@Module({
  imports: [SequelizeModule.forFeature([Group, User, Person, Organization]), TransactionHistoryModule, BranchModule, SeederModule.forFeature([GroupSeeds])],
  controllers: [GroupController],
  providers: [GroupService, UsersService, OrganizationService],
  exports: [GroupService],
})
export class GroupModule {}
