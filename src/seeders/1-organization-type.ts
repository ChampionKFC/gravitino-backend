'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('OrganizationTypes', [
      {
        organization_type_id: 1,
        organization_type_name: 'Уборка',
      },
      {
        organization_type_id: 2,
        organization_type_name: 'Ремонт сантехники',
      },
      {
        organization_type_id: 3,
        organization_type_name: 'Деятельность 3',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('OrganizationTypes', null, {})
  },
}
