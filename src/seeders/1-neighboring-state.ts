'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('NeighboringStates', [
      { neighboring_state_id: 1, neighboring_state_name: 'Китай' },
      { neighboring_state_id: 2, neighboring_state_name: 'Монголия' },
      { neighboring_state_id: 3, neighboring_state_name: 'Казахстан' },
      { neighboring_state_id: 4, neighboring_state_name: 'Грузия' },
      { neighboring_state_id: 5, neighboring_state_name: 'Абхазия' },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('NeighboringStates', null, {})
  },
}
