'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('OperatingModes', [
      { operating_mode_id: 1, operating_mode_name: 'Постоянный' },
      { operating_mode_id: 2, operating_mode_name: 'По будням' },
      { operating_mode_id: 3, operating_mode_name: 'По выходным' },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('OperatingModes', null, {})
  },
}
