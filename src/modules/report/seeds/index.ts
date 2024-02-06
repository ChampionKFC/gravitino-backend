import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Report } from '../entities/report.entity';

@Seeder({
  model: Report,
  unique: ['file_sku'],
  containsForeignKeys: true,
  foreignDelay: 10000,
})
export class ReportSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        report_user_id: 1,
        file_sku: '1',
        file_alt: 'Alt файла',
        file_type_id: 1,
        report_json: {
          field: 'value',
        },
      },
      {
        report_user_id: 2,
        file_sku: '2',
        file_alt: 'Alt файла',
        file_type_id: 1,
        report_json: {
          field: 'value',
        },
      },
      {
        report_user_id: 3,
        file_sku: '3',
        file_alt: 'Alt файла',
        file_type_id: 1,
        report_json: {
          field: 'value',
        },
      },
      {
        report_user_id: 4,
        file_sku: '4',
        file_alt: 'Alt файла',
        file_type_id: 1,
        report_json: {
          field: 'value',
        },
      },
      {
        report_user_id: 5,
        file_sku: '5',
        file_alt: 'Alt файла',
        file_type_id: 1,
        report_json: {
          field: 'value',
        },
      },
    ];
    return data;
  }
}
