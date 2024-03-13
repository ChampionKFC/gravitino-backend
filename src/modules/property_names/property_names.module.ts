import { Module } from '@nestjs/common'
import { PropertyNamesService } from './property_names.service'
import { PropertyNamesController } from './property_names.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { PropertyName } from './entities/property_name.entity'
import { PropertyValuesService } from '../property_values/property_values.service'
import { PropertyValue } from '../property_values/entities/property_value.entity'
import { UsersModule } from '../users/users.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { PermissionsService } from '../permissions/permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'

@Module({
  imports: [SequelizeModule.forFeature([PropertyName, PropertyValue, RolePermission, Permission]), TransactionHistoryModule, UsersModule],
  controllers: [PropertyNamesController],
  providers: [PropertyNamesService, PropertyValuesService, RolesPermissionsService, PermissionsService],
  exports: [PropertyNamesService],
})
export class PropertyNamesModule {}
