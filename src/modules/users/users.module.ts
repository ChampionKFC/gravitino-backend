import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { Person } from 'src/modules/person/entities/person.entity'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { RolesModule } from '../roles/roles.module'
import { OrganizationModule } from '../organization/organization.module'
import { GroupModule } from '../group/group.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { PermissionsService } from '../permissions/permissions.service'
import { Permission } from '../permissions/entities/permission.entity'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationTypeModule } from '../organization_type/organization_type.module'

@Module({
  imports: [
    SequelizeModule.forFeature([User, Person, RolePermission, Permission, Organization]),
    RolesModule,
    OrganizationModule,
    OrganizationTypeModule,
    GroupModule,
    TransactionHistoryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesPermissionsService, PermissionsService],
  exports: [UsersService],
})
export class UsersModule {}
