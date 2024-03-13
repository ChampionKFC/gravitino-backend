'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('OrderStatuses', [
      {
        order_status_id: 9,
        order_status_name: 'Не назначена',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('OrderStatuses', null, {})
  },
}
