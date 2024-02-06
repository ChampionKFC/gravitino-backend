import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { PropertyName } from '../entities/property_name.entity';

@Seeder({
  model: PropertyName,
  unique: ['property_name'],
})
export class PropertyNameSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        property_name: 'Характеристика 1',
        entity_name: 'Сущность',
      },
      {
        property_name: 'Характеристика 2',
        entity_name: 'Сущность',
      },
      {
        property_name: 'Характеристика 3',
        entity_name: 'Сущность',
      },
      {
        property_name: 'Характеристика 4',
        entity_name: 'Сущность',
      },
      {
        property_name: 'Характеристика 5',
        entity_name: 'Сущность',
      },
    ];
    return data;
  }
}
