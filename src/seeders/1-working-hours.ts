'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('WorkingHours', [
      { working_hours_id: 1, working_hours_name: 'Круглосуточно' },
      { working_hours_id: 2, working_hours_name: '10:00-23:00' },
      { working_hours_id: 3, working_hours_name: '4:00-16:00' },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('WorkingHours', null, {})
  },
}
