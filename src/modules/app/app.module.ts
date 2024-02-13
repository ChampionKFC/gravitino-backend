import { Module } from '@nestjs/common'
import { FileTypeModule } from '../file_type/file_type.module'
import { FileType } from '../file_type/entities/file_type.entity'
import { SequelizeModule } from '@nestjs/sequelize'
import { OrderStatus } from '../order_status/entities/order_status.entity'
import { OrderStatusModule } from '../order_status/order_status.module'
import { Organization } from '../organization/entities/organization.entity'
import { OrganizationModule } from '../organization/organization.module'
import { Role } from '../roles/entities/role.entity'
import { RolesModule } from '../roles/roles.module'
import { User } from '../users/entities/user.entity'
import { UsersModule } from '../users/users.module'
import { PersonModule } from '../person/person.module'
import { Person } from '../person/entities/person.entity'
import { OrganizationTypeModule } from '../organization_type/organization_type.module'
import { OrganizationType } from '../organization_type/entities/organization_type.entity'
import { GroupModule } from '../group/group.module'
import { Group } from '../group/entities/group.entity'
import { TaskModule } from '../task/task.module'
import { Task } from '../task/entities/task.entity'
import { PriorityModule } from '../priority/priority.module'
import { OrderPriority } from '../priority/entities/priority.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { OrderModule } from '../order/order.module'
import configuration from 'src/config/configuration'
import { Auth } from '../auth/entities/auth.entity'
import { Category } from '../category/entities/category.entity'
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity'
import { AuthModule } from '../auth/auth.module'
import { CategoryModule } from '../category/category.module'
import { CheckpointModule } from '../checkpoint/checkpoint.module'
import { Order } from '../order/entities/order.entity'
import { Permission } from '../permissions/entities/permission.entity'
import { RolePermission } from '../roles_permissions/entities/roles_permission.entity'
import { TransactionHistory } from '../transaction_history/entities/transaction_history.entity'
import { PermissionsModule } from '../permissions/permissions.module'
import { RolesPermissionsModule } from '../roles_permissions/roles_permissions.module'
import { TransactionHistoryModule } from '../transaction_history/transaction_history.module'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { Branch } from '../branch/entities/branch.entity'
import { BranchModule } from '../branch/branch.module'
import { File } from '../files/entities/file.entity'
import { FilesModule } from '../files/files.module'
import { PropertyValue } from '../property_values/entities/property_value.entity'
import { PropertyName } from '../property_names/entities/property_name.entity'
import { PropertyNamesModule } from '../property_names/property_names.module'
import { PropertyValuesModule } from '../property_values/property_values.module'
import { Facility } from '../facility/entities/facility.entity'
import { FacilityModule } from '../facility/facility.module'
import { PeriodicityModule } from '../periodicity/periodicity.module'
import { Periodicity } from '../periodicity/entities/periodicity.entity'
import { CheckpointType } from '../checkpoint_type/entities/checkpoint_type.entity'
import { CheckpointTypeModule } from '../checkpoint_type/checkpoint_type.module'
import { OrderJournal } from '../order_journal/entities/order_journal.entity'
import { OrderJournalModule } from '../order_journal/order_journal.module'
import { NeighboringState } from '../neighboring_state/entities/neighboring_state.entity'
import { WorkingHours } from '../working_hours/entities/working_hour.entity'
import { OperatingMode } from '../operating_mode/entities/operating_mode.entity'
import { WorkingHoursModule } from '../working_hours/working_hours.module'
import { OperatingModeModule } from '../operating_mode/operating_mode.module'
import { NeighboringStateModule } from '../neighboring_state/neighboring_state.module'
import { FacilityTypeModule } from '../facility_type/facility_type.module'
import { FacilityType } from '../facility_type/entities/facility_type.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SeederModule.forRoot({
      isGlobal: true,
      logging: true,
      runOnlyIfTableIsEmpty: false,
      foreignDelay: 2000,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('db_host'),
        username: configService.get('db_username'),
        password: configService.get('db_password'),
        database: configService.get('db_name'),
        autoLoadModels: true,
        logging: true,
        synchronize: true,
        models: [
          User,
          //Gender,
          Auth,
          Person,
          //PersonStatus,
          Role,
          Group,
          Organization,
          OrganizationType,
          Task,
          Category,
          OrderStatus,
          OrderPriority,
          Checkpoint,
          FileType,
          FacilityType,
          //Report,
          Order,
          Permission,
          RolePermission,
          TransactionHistory,
          Branch,
          File,
          PropertyValue,
          PropertyName,
          Facility,
          Periodicity,
          CheckpointType,
          OrderJournal,
          NeighboringState,
          WorkingHours,
          OperatingMode,
        ],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    //GenderModule,
    PersonModule,
    //PersonStatusModule,
    RolesModule,
    GroupModule,

    OrganizationModule,
    OrganizationTypeModule,

    FacilityModule,
    FacilityTypeModule,
    CheckpointModule,
    CheckpointTypeModule,
    BranchModule,

    OrderModule,
    OrderJournalModule,
    OrderStatusModule,
    PriorityModule,

    TaskModule,
    PeriodicityModule,
    CategoryModule,

    FileTypeModule,
    FilesModule,
    //ReportModule,

    PermissionsModule,
    RolesPermissionsModule,

    TransactionHistoryModule,

    PropertyNamesModule,
    PropertyValuesModule,

    WorkingHoursModule,
    OperatingModeModule,
    NeighboringStateModule,
  ],
})
export class AppModule {}
