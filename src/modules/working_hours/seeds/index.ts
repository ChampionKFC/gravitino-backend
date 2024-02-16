import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder'
import { WorkingHours } from '../entities/working_hour.entity'

@Seeder({
  model: WorkingHours,
  unique: ['working_hours_name'],
})
export class WorkingHoursSeeds implements OnSeederInit {
  run() {
    const data = [
      { working_hours_id: 1, working_hours_name: 'Круглосуточно' },
      { working_hours_id: 2, working_hours_name: '10:00-23:00' },
      { working_hours_id: 3, working_hours_name: '4:00-16:00' },
    ]
    return data
  }
}
