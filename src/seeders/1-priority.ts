'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('OrderPriorities', [
      { priority_id: 1, priority_name: 'Высокий' },
      {
        priority_id: 2,
        priority_name: 'Средний',
      },
      {
        priority_id: 3,
        priority_name: 'Низкий',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('OrderPriorities', null, {})
  },
}
