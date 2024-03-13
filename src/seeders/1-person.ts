'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('People', [
      {
        person_id: 1,
        last_name: 'Иванов',
        first_name: 'Иван',
        patronymic: 'Иванович',
        phone: '+79001234567',
      },
      {
        person_id: 2,
        last_name: 'Панов',
        first_name: 'Дмитрий',
        patronymic: 'Георгиевич',
        phone: '+79007976431',
      },
      {
        person_id: 3,
        last_name: 'Попов',
        first_name: 'Виктор',
        patronymic: 'Михайлович',
        phone: '+79007895498',
      },
      {
        person_id: 4,
        last_name: 'Быкова',
        first_name: 'Екатерина',
        patronymic: 'Захаровна',
        phone: '+78004596587',
      },
      {
        person_id: 5,
        last_name: 'Сергеев',
        first_name: 'Артём',
        patronymic: 'Иванович',
        phone: '+77778756532',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('People', null, {})
  },
}
