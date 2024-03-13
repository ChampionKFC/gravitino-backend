'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('OrderStatuses', [
      {
        order_status_id: 1,
        order_status_name: 'Создана',
      },
      {
        order_status_id: 2,
        order_status_name: 'Назначена',
      },
      {
        order_status_id: 3,
        order_status_name: 'В работе',
      },
      {
        order_status_id: 4,
        order_status_name: 'На проверке',
      },
      {
        order_status_id: 5,
        order_status_name: 'Закрыта',
      },
      {
        order_status_id: 6,
        order_status_name: 'Отменена',
      },
      {
        order_status_id: 7,
        order_status_name: 'Закрыта с нарушением дедлайна',
      },
      {
        order_status_id: 8,
        order_status_name: 'Необходима доработка',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('OrderStatuses', null, {})
  },
}
