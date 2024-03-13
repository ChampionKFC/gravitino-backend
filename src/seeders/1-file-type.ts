'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('FileTypes', [
      {
        file_type_id: 1,
        file_type_name: 'Excel',
        file_extension: 'xls',
      },
      {
        file_type_id: 2,
        file_type_name: 'Picture',
        file_extension: 'png',
      },
      {
        file_type_id: 3,
        file_type_name: 'Word',
        file_extension: 'docx',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('FileTypes', null, {})
  },
}
