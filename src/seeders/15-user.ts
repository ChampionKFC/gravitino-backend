'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        user_id: 1,
        person_id: 1,
        role_id: 5,
        email: 'user1@mail.com',
        password: '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
      {
        user_id: 2,
        person_id: 2,
        role_id: 2,
        group_id: 2,
        email: 'user2@mail.com',
        password: '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
      {
        user_id: 3,
        person_id: 3,
        role_id: 3,
        group_id: 2,
        email: 'user3@mail.com',
        password: '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
      {
        user_id: 4,
        person_id: 4,
        role_id: 4,
        group_id: 1,
        email: 'user4@mail.com',
        password: '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
      {
        user_id: 5,
        organization_id: 5,
        role_id: 1,
        email: 'user5@mail.com',
        password: '$2b$10$4CZ0VehhDCyL4WT4CmA2z.gwC2QCNMR9rRpVcWkYgNtMCaJwny/jq',
        is_active: true,
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {})
  },
}
