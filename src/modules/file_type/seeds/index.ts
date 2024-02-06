import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { FileType } from '../entities/file_type.entity';

@Seeder({
  model: FileType,
  unique: ['file_type_name'],
})
export class FileTypeSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        file_type_name: 'Excel',
        file_extension: 'xls',
      },
      {
        file_type_name: 'Picture',
        file_extension: 'png',
      },
      {
        file_type_name: 'Word',
        file_extension: 'docx',
      },
    ];
    return data;
  }
}
