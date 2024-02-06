import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { PropertyValue } from '../entities/property_value.entity';

@Seeder({
  model: PropertyValue,
  unique: ['property_name_id'],
  containsForeignKeys: true,
  foreignDelay: 2000,
})
export class PropertyValueSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        property_name_id: 1,
        property_value: '10',
      },
      {
        property_name_id: 2,
        property_value: '10',
      },
      {
        property_name_id: 3,
        property_value: '10',
      },
      {
        property_name_id: 4,
        property_value: '10',
      },
      {
        property_name_id: 5,
        property_value: '10',
      },
    ];
    return data;
  }
}
