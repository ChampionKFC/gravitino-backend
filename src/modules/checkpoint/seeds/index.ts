import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder'
import { Checkpoint } from '../entities/checkpoint.entity'

@Seeder({
  model: Checkpoint,
  unique: ['checkpoint_name'],
  containsForeignKeys: true,
  foreignDelay: 10000,
})
export class CheckpointSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        checkpoint_name: 'Пункт пропуска 1',
        address: '019574, Ленинградская область, город Сергиев Посад, въезд Славы, 78',
        branch_id: 1,
        neighboring_state_id: 1,
        district: 'Округ',
        region: 'Ленинградская область',
        checkpoint_type_id: 1,
        working_hours_id: 1,
        operating_mode_id: 1,
      },
      {
        checkpoint_name: 'Пункт пропуска 2',
        address: '827016, Костромская область, город Серпухов, шоссе Сталина, 89',
        branch_id: 1,
        neighboring_state_id: 1,
        district: 'Округ',
        region: 'Костромская область',
        checkpoint_type_id: 1,
        working_hours_id: 1,
        operating_mode_id: 1,
      },
      {
        checkpoint_name: 'Пункт пропуска 3',
        address: '773161, Томская область, город Серпухов, въезд Гагарина, 16',
        branch_id: 1,
        neighboring_state_id: 1,
        district: 'Округ',
        region: 'Томская область',
        checkpoint_type_id: 1,
        working_hours_id: 1,
        operating_mode_id: 1,
      },
      {
        checkpoint_name: 'Пункт пропуска 4',
        address: '118905, Сахалинская область, город Орехово-Зуево, бульвар Чехова, 70',
        branch_id: 1,
        neighboring_state_id: 1,
        district: 'Округ',
        region: 'Сахалинская область',
        checkpoint_type_id: 1,
        working_hours_id: 1,
        operating_mode_id: 1,
      },
      {
        checkpoint_name: 'Пункт пропуска 5',
        address: '949914, Курганская область, город Орехово-Зуево, ул. Балканская, 88',
        branch_id: 1,
        neighboring_state_id: 1,
        district: 'Округ',
        region: 'Курганская область',
        checkpoint_type_id: 1,
        working_hours_id: 1,
        operating_mode_id: 1,
      },
    ]
    return data
  }
}
