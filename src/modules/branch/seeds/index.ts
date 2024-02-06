import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Branch } from '../entities/branch.entity';

@Seeder({
  model: Branch,
  unique: ['branch_name'],
})
export class BranchSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        branch_name: 'Филиал 1',
        branch_address:
          '019574, Ленинградская область, город Сергиев Посад, въезд Славы, 78',
      },
      {
        branch_name: 'Филиал 2',
        branch_address:
          '827016, Костромская область, город Серпухов, шоссе Сталина, 89',
      },
      {
        branch_name: 'Филиал 3',
        branch_address: '773161, Томская область, город Серпухов, въезд Гагарина, 16',
      },
      {
        branch_name: 'Филиал 4',
        branch_address:
          '118905, Сахалинская область, город Орехово-Зуево, бульвар Чехова, 70',
      },
      {
        branch_name: 'Филиал 5',
        branch_address:
          '949914, Курганская область, город Орехово-Зуево, ул. Балканская, 88',
      },
    ];
    return data;
  }
}
