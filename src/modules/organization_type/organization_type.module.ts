import { Module } from '@nestjs/common'
import { OrganizationTypeService } from './organization_type.service'
import { OrganizationTypeController } from './organization_type.controller'
import { OrganizationType } from './entities/organization_type.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { OrganizationTypeSeeds } from './seeds'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationService } from '../organization/organization.service'
import { Person } from '../person/entities/person.entity'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'

@Module({
  imports: [
    SequelizeModule.forFeature([OrganizationType, User, Person, Organization]),
    TransactionHistoryModule,
    SeederModule.forFeature([OrganizationTypeSeeds]),
  ],
  controllers: [OrganizationTypeController],
  providers: [OrganizationTypeService, UsersService, OrganizationService],
  exports: [OrganizationTypeService],
})
export class OrganizationTypeModule {}
