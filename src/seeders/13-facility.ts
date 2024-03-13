'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Facilities', [
      {
        facility_id: 1,
        facility_name: 'Объект обслуживания 1',
        organization_ids: [1, 2],
        checkpoint_id: 1,
        facility_type_id: 1,
      },
      {
        facility_id: 2,
        facility_name: 'Объект обслуживания 2',
        organization_ids: [3],
        checkpoint_id: 2,
        facility_type_id: 2,
      },
      {
        facility_id: 3,
        facility_name: 'Объект обслуживания 3',
        organization_ids: [4],
        checkpoint_id: 3,
        facility_type_id: 3,
      },
      {
        facility_id: 4,
        facility_name: 'Объект обслуживания 4',
        organization_ids: [5],
        checkpoint_id: 1,
        facility_type_id: 1,
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Facilities', null, {})
  },
}
