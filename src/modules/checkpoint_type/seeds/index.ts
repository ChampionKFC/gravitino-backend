import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { CheckpointType } from '../entities/checkpoint_type.entity';

@Seeder({
    model: CheckpointType,
    unique: ['checkpoint_type_name'],
})
export class CheckpointTypeSeeds implements OnSeederInit {
    run() {
        const data = [
            {
                checkpoint_type_id: 1,
                checkpoint_type_name: 'Тип ПП 1',
            },
            {
                checkpoint_type_id: 2,
                checkpoint_type_name: 'Тип ПП 2',
            },
            {
                checkpoint_type_id: 3,
                checkpoint_type_name: 'Тип ПП 3',
            },
            {
                checkpoint_type_id: 4,
                checkpoint_type_name: 'Тип ПП 4',
            },
            {
                checkpoint_type_id: 5,
                checkpoint_type_name: 'Тип ПП 5',
            },
        ];
        return data;
    }
}
