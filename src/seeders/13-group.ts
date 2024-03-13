'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Groups', [
      {
        group_id: 1,
        group_name: 'Группа 1',
        branch_id: 1,
      },
      {
        group_id: 2,
        group_name: 'Группа 2',
        checkpoint_id: 1,
      },
      {
        group_id: 3,
        group_name: 'Группа 3',
        facility_id: 1,
      },
      {
        group_id: 4,
        group_name: 'Группа 4',
      },
      {
        group_id: 5,
        group_name: 'Группа 5',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Groups', null, {})
  },
}
