import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { OrganizationType } from '../entities/organization_type.entity';

@Seeder({
  model: OrganizationType,
  unique: ['organization_type_name'],
})
export class OrganizationTypeSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        organization_type_name: 'Уборка',
      },
      {
        organization_type_name: 'Ремонт сантехники',
      },
      {
        organization_type_name: 'Деятельность 3',
      },
    ];
    return data;
  }
}
