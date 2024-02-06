import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { User } from '../entities/user.entity';

@Seeder({
  model: User,
  unique: ['email'],
  containsForeignKeys: true,
  foreignDelay: 4000,
})
export class UserSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        person_id: 1,
        organization_id: 1,
        role_id: 1,
        email: 'user1@mail.com',
        password:
          '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
      {
        person_id: 2,
        organization_id: 2,
        role_id: 2,
        group_id: 2,
        email: 'user2@mail.com',
        password:
          '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
      {
        person_id: 3,
        organization_id: 3,
        role_id: 3,
        group_id: 3,
        email: 'user3@mail.com',
        password:
          '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
      {
        person_id: 4,
        organization_id: 4,
        role_id: 1,
        group_id: 4,
        email: 'user4@mail.com',
        password:
          '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
      {
        person_id: 5,
        organization_id: 5,
        role_id: 1,
        group_id: 5,
        email: 'user5@mail.com',
        password:
          '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
    ];
    return data;
  }
}
