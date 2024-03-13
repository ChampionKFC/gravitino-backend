'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [
      {
        role_id: 1,
        role_name: 'Подрядчик',
      },
      {
        role_id: 2,
        role_name: 'Главный инженер пункта пропуска',
      },
      {
        role_id: 3,
        role_name: 'Работник пункта пропуска',
      },
      {
        role_id: 4,
        role_name: 'Работник филиала',
      },
      {
        role_id: 5,
        role_name: 'Администратор',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Roles', null, {})
  },
}
