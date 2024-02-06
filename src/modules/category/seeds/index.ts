import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Category } from '../entities/category.entity';

@Seeder({
  model: Category,
  unique: ['category_name'],
})
export class CategorySeeds implements OnSeederInit {
  run() {
    const data = [
      {
        category_name: 'Категория 1',
      },
      {
        category_name: 'Категория 2',
      },
      {
        category_name: 'Категория 3',
      },
      {
        category_name: 'Категория 4',
      },
      {
        category_name: 'Категория 5',
      },
    ];
    return data;
  }
}
