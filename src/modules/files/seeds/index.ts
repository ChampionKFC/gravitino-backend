import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { File } from '../entities/file.entity';

@Seeder({
  model: File,
  unique: ['file_sku'],
  containsForeignKeys: true,
  foreignDelay: 22000,
})
export class FileSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        order_id: 1,
        file_sku: 'file1',
        file_alt: 'Файл 1',
        file_type_id: 1,
      },
      {
        order_id: 1,
        file_sku: 'file2',
        file_alt: 'Файл 2',
        file_type_id: 1,
      },
      {
        order_id: 1,
        file_sku: 'file3',
        file_alt: 'Файл 3',
        file_type_id: 1,
      },
      {
        order_id: 1,
        file_sku: 'file4',
        file_alt: 'Файл 4',
        file_type_id: 1,
      },
      {
        order_id: 1,
        file_sku: 'file5',
        file_alt: 'Файл 5',
        file_type_id: 1,
      },
    ];
    return data;
  }
}
