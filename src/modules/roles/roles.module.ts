import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { Role } from './entities/role.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { RoleSeeds } from './seeds'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { Person } from '../person/entities/person.entity'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationService } from '../organization/organization.service'

@Module({
  imports: [SequelizeModule.forFeature([Role, User, Person, Organization]), TransactionHistoryModule, SeederModule.forFeature([RoleSeeds])],
  controllers: [RolesController],
  providers: [RolesService, UsersService, OrganizationService],
  exports: [RolesService],
})
export class RolesModule {}
