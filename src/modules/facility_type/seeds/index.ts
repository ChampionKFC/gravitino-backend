import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder'
import { FacilityType } from '../entities/facility_type.entity'

@Seeder({
  model: FacilityType,
  unique: ['facility_type_name'],
})
export class FacilityTypeSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        facility_type_id: 1,
        facility_type_name: 'Котельная',
      },
      {
        facility_type_id: 2,
        facility_type_name: 'Административное здание',
      },
      {
        facility_type_id: 3,
        facility_type_name: 'КПП',
      },
    ]
    return data
  }
}
