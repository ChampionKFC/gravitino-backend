'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Categories', [
      {
        category_id: 1,
        category_name: 'Категория 1',
      },
      {
        category_id: 2,
        category_name: 'Категория 2',
      },
      {
        category_id: 3,
        category_name: 'Категория 3',
      },
      {
        category_id: 4,
        category_name: 'Категория 4',
      },
      {
        category_id: 5,
        category_name: 'Категория 5',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Categories', null, {})
  },
}
