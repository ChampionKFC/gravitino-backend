import { Module } from '@nestjs/common'
import { FileTypeService } from './file_type.service'
import { FileTypeController } from './file_type.controller'
import { FileType } from './entities/file_type.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { UsersModule } from '../users/users.module'
import { RolesPermissionsService } from '../roles_permissions/roles_permissions.service'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { PermissionsService } from '../permissions/permissions.service'

@Module({
  imports: [SequelizeModule.forFeature([FileType, RolePermission, Permission]), TransactionHistoryModule, UsersModule],
  controllers: [FileTypeController],
  providers: [FileTypeService, RolesPermissionsService, PermissionsService],
  exports: [FileTypeService],
})
export class FileTypeModule {}
