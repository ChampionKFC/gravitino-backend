import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Group } from '../entities/group.entity';

@Seeder({
  model: Group,
  unique: ['group_name'],
  containsForeignKeys: true,
  foreignDelay: 2000,
})
export class GroupSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        group_name: 'Группа 1',
        branch_id: 1,
      },
      {
        group_name: 'Группа 2',
      },
      {
        group_name: 'Группа 3',
      },
      {
        group_name: 'Группа 4',
      },
      {
        group_name: 'Группа 5',
      },
    ];
    return data;
  }
}
