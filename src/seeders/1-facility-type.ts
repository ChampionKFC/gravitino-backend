'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('FacilityTypes', [
      {
        facility_type_id: 1,
        facility_type_name: 'Котельная',
      },
      {
        facility_type_id: 2,
        facility_type_name: 'Административное здание',
      },
      {
        facility_type_id: 3,
        facility_type_name: 'КПП',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('FacilityTypes', null, {})
  },
}
