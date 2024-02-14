import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder'
import { Facility } from '../entities/facility.entity'

@Seeder({
  model: Facility,
  unique: ['facility_name'],
  containsForeignKeys: true,
  foreignDelay: 12000,
})
export class FacilitySeeds implements OnSeederInit {
  run() {
    const data = [
      {
        facility_name: 'Объект обслуживания 1',
        organization_id: 1,
        checkpoint_id: 1,
        facility_type_id: 1,
      },
      {
        facility_name: 'Объект обслуживания 2',
        organization_id: 2,
        checkpoint_id: 2,
        facility_type_id: 2,
      },
      {
        facility_name: 'Объект обслуживания 3',
        organization_id: 3,
        checkpoint_id: 3,
        facility_type_id: 3,
      },
      {
        facility_name: 'Объект обслуживания 4',
        organization_id: 1,
        checkpoint_id: 1,
        facility_type_id: 1,
      },
      {
        facility_name: 'Объект обслуживания 5',
        organization_id: 1,
        checkpoint_id: 1,
        facility_type_id: 1,
      },
    ]
    return data
  }
}
