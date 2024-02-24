import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder'
import { NeighboringState } from '../entities/neighboring_state.entity'

@Seeder({
  model: NeighboringState,
  unique: ['neighboring_state_name'],
})
export class NeighboringStateSeeds implements OnSeederInit {
  run() {
    const data = [
      { neighboring_state_id: 1, neighboring_state_name: 'Китай' },
      { neighboring_state_id: 2, neighboring_state_name: 'Монголия' },
      { neighboring_state_id: 3, neighboring_state_name: 'Казахстан' },
      { neighboring_state_id: 4, neighboring_state_name: 'Грузия' },
      { neighboring_state_id: 5, neighboring_state_name: 'Абхазия' },
    ]
    return data
  }
}
