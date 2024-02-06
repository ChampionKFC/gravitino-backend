import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Person } from '../entities/person.entity';
@Seeder({
  model: Person,
  unique: ['phone'],
  containsForeignKeys: true,
})
export class PersonSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        last_name: 'Иванов',
        first_name: 'Иван',
        patronymic: 'Иванович',
        phone: '+79001234567',
      },
      {
        last_name: 'Панов',
        first_name: 'Дмитрий',
        patronymic: 'Георгиевич',
        phone: '+79007976431',
      },
      {
        last_name: 'Попов',
        first_name: 'Виктор',
        patronymic: 'Михайлович',
        phone: '+79007895498',
      },
      {
        last_name: 'Быкова',
        first_name: 'Екатерина',
        patronymic: 'Захаровна',
        phone: '+78004596587',
      },
      {
        last_name: 'Сергеев',
        first_name: 'Артём',
        patronymic: 'Иванович',
        phone: '+77778756532',
      },
    ];
    return data;
  }
}
