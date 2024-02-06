import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Person } from 'src/modules/person/entities/person.entity';
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity';
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module';
import { RolesModule } from '../roles/roles.module';
import { OrganizationModule } from '../organization/organization.module';
import { GroupModule } from '../group/group.module';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { UserSeeds } from './seeds';
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service';
import { PermissionsService } from '../permissions/permissions.service';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Person, RolePermission, Permission]), RolesModule, OrganizationModule, GroupModule, TransactionHistoryModule,
    SeederModule.forFeature([UserSeeds]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesPermissionsService, PermissionsService],
  exports: [UsersService],
})
export class UsersModule { }
