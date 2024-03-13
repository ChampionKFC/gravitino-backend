'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Periodicities', [
      {
        periodicity_id: 1,
        periodicity_name: 'Ежедневно',
      },
      {
        periodicity_id: 2,
        periodicity_name: 'Еженедельно',
      },
      {
        periodicity_id: 3,
        periodicity_name: 'Ежегодно',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Periodicities', null, {})
  },
}
