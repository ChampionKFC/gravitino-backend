import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { OrderPriority } from '../entities/priority.entity';

@Seeder({
  model: OrderPriority,
  unique: ['priority_name'],
})
export class OrderPrioritySeeds implements OnSeederInit {
  run() {
    const data = [
      {
        priority_name: 'Высокий',
      },
      {
        priority_name: 'Средний',
      },
      {
        priority_name: 'Низкий',
      },
    ];
    return data;
  }
}
