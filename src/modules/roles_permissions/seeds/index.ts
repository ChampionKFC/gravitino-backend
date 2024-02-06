import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { RolePermission } from '../entities/roles_permission.entity';

@Seeder({
  model: RolePermission,
  unique: ['role_id'],
  containsForeignKeys: true,
  foreignDelay: 6000,
})
export class RolePermissionSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        role_id: 1,
        permission_id: 1,
        rights: false,
      },
      {
        user_id: 1,
        permission_id: 1,
        rights: true,
      },
    ];
    return data;
  }
}
