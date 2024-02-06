import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Role } from '../entities/role.entity';

@Seeder({
  model: Role,
  unique: ['role_name'],
})
export class RoleSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        role_name: 'Пользователь',
      },
      {
        role_name: 'Подрядчик',
      },
      {
        role_name: 'Администратор',
      },
    ];
    return data;
  }
}
