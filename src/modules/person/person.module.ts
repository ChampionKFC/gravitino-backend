import { Module } from '@nestjs/common'
import { PersonService } from './person.service'
import { PersonController } from './person.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Person } from './entities/person.entity'
import { UsersModule } from '../users/users.module'
import { PermissionsService } from '../permissions/permissions.service'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { TransactionHistory } from '../transaction_history/entities/transaction_history.entity'

@Module({
  imports: [SequelizeModule.forFeature([Person, RolePermission, Permission, TransactionHistory]), UsersModule],
  controllers: [PersonController],
  providers: [PersonService, RolesPermissionsService, PermissionsService, TransactionHistoryService],
  exports: [PersonService],
})
export class PersonModule {}
