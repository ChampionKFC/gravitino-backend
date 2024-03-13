'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('CheckpointTypes', [
      {
        checkpoint_type_id: 1,
        checkpoint_type_name: 'Автомобильный пункт пропуска',
      },
      {
        checkpoint_type_id: 2,
        checkpoint_type_name: 'Железнодорожный пункт пропуска',
      },
      {
        checkpoint_type_id: 3,
        checkpoint_type_name: 'Морской пункт пропуска',
      },
      {
        checkpoint_type_id: 4,
        checkpoint_type_name: 'Воздушный пункт пропуска',
      },
      {
        checkpoint_type_id: 5,
        checkpoint_type_name: 'Речной пункт пропуска',
      },
      {
        checkpoint_type_id: 6,
        checkpoint_type_name: 'Смешанный пункт пропуска',
      },
      {
        checkpoint_type_id: 7,
        checkpoint_type_name: 'Пешеходный пункт пропуска',
      },
      {
        checkpoint_type_id: 8,
        checkpoint_type_name: 'Озерный пункт пропуска',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('CheckpointTypes', null, {})
  },
}
