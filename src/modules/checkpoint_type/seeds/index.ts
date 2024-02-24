import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder'
import { CheckpointType } from '../entities/checkpoint_type.entity'

@Seeder({
  model: CheckpointType,
  unique: ['checkpoint_type_name'],
})
export class CheckpointTypeSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        checkpoint_type_id: 1,
        checkpoint_type_name: 'Автомобильный пункт пропуска',
      },
      {
        checkpoint_type_id: 2,
        checkpoint_type_name: 'Железнодорожный пункт пропуска',
      },
      {
        checkpoint_type_id: 3,
        checkpoint_type_name: 'Морской пункт пропуска',
      },
      {
        checkpoint_type_id: 4,
        checkpoint_type_name: 'Воздушный пункт пропуска',
      },
    ]
    return data
  }
}
