import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Task } from '../entities/task.entity';

@Seeder({
  model: Task,
  unique: ['task_name'],
  containsForeignKeys: true,
  foreignDelay: 2000,
})
export class TaskSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        task_id: 1,
        task_name: 'Задача №1',
        task_description: 'Описание задачи',
        category_id: 1,
        periodicity_id: 1,
        period_start: new Date('2024-01-01'),
        period_end: new Date('2024-12-31'),
      },
      {
        task_id: 2,
        task_name: 'Задача №2',
        task_description: 'Описание задачи',
        category_id: 1,
        periodicity_id: 1,
        period_start: new Date('2024-01-01'),
        period_end: new Date('2024-12-31'),
      },
      {
        task_id: 3,
        task_name: 'Задача №3',
        task_description: 'Описание задачи',
        category_id: 3,
        periodicity_id: 1,
        period_start: new Date('2024-01-01'),
        period_end: new Date('2024-12-31'),
      },
      {
        task_id: 4,
        task_name: 'Задача №4',
        task_description: 'Описание задачи',
        category_id: 4,
        periodicity_id: 3,
        period_start: new Date('2024-01-01'),
        period_end: new Date('2024-12-31'),
      },
      {
        task_id: 5,
        task_name: 'Задача №5',
        task_description: 'Описание задачи',
        category_id: 5,
        periodicity_id: 3,
        period_start: new Date('2024-01-01'),
        period_end: new Date('2024-12-31'),
      },
    ];
    return data;
  }
}
