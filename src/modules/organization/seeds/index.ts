import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Organization } from '../entities/organization.entity';

@Seeder({
  model: Organization,
  unique: ['full_name'],
  containsForeignKeys: true,
  foreignDelay: 2000,
})
export class OrganizationSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        organization_type_id: 1,
        full_name: 'ООО "Компания 1"',
        short_name: 'Компания 1',
        register_number: '124854464',
        phone: '+79951692544',
        email: 'company1@mail.com',
      },
      {
        organization_type_id: 1,
        full_name: 'ООО "Компания 2"',
        short_name: 'Компания 2',
        register_number: '154156652',
        phone: '+79517522363',
        email: 'company2@mail.com',
      },
      {
        organization_type_id: 1,
        full_name: 'ООО "Компания 3"',
        short_name: 'Компания 3',
        register_number: '2125313213',
        phone: '+79327544163',
        email: 'company3@mail.com',
      },
      {
        organization_type_id: 1,
        full_name: 'ООО "Компания 4"',
        short_name: 'Компания 4',
        register_number: '212122134',
        phone: '+79354944154',
        email: 'company4@mail.com',
      },
      {
        organization_type_id: 1,
        full_name: 'ИП Иванов',
        short_name: 'ИП Иванов',
        register_number: '848486848',
        phone: '+79587944132',
        email: 'ivanov.i@mail.com',
      },
    ];
    return data;
  }
}
