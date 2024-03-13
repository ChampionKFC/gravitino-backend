'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Branches', [
      {
        branch_id: 1,
        branch_name: 'Филиал 1',
        branch_address: '019574, Ленинградская область, город Сергиев Посад, въезд Славы, 78',
      },
      {
        branch_id: 2,
        branch_name: 'Филиал 2',
        branch_address: '827016, Костромская область, город Серпухов, шоссе Сталина, 89',
      },
      {
        branch_id: 3,
        branch_name: 'Филиал 3',
        branch_address: '773161, Томская область, город Серпухов, въезд Гагарина, 16',
      },
      {
        branch_id: 4,
        branch_name: 'Филиал 4',
        branch_address: '118905, Сахалинская область, город Орехово-Зуево, бульвар Чехова, 70',
      },
      {
        branch_id: 5,
        branch_name: 'Филиал 5',
        branch_address: '949914, Курганская область, город Орехово-Зуево, ул. Балканская, 88',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Branches', null, {})
  },
}
