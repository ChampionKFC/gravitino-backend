import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder'
import { OperatingMode } from '../entities/operating_mode.entity'

@Seeder({
  model: OperatingMode,
  unique: ['operating_mode_name'],
})
export class OperatingModeSeeds implements OnSeederInit {
  run() {
    const data = [{ operating_mode_name: 'Постоянный' }, { operating_mode_name: 'По будням' }, { operating_mode_name: 'По выходным' }]
    return data
  }
}
