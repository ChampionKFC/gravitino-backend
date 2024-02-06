import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Periodicity } from '../entities/periodicity.entity';

@Seeder({
    model: Periodicity,
    unique: ['periodicity_name'],
})
export class PeriodicitySeeds implements OnSeederInit {
    run() {
        const data = [
            {
                periodicity_id: 1,
                periodicity_name: 'Ежедневно',
            },
            {
                periodicity_id: 2,
                periodicity_name: 'Еженедельно',
            },
            {
                periodicity_id: 3,
                periodicity_name: 'Ежегодно',
            },
        ];
        return data;
    }
}
