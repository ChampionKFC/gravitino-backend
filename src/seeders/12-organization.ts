'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Organizations', [
      {
        organization_id: 1,
        organization_type_id: 1,
        full_name: 'ООО "Компания 1"',
        short_name: 'Компания 1',
        phone: '+79951692544',
      },
      {
        organization_id: 2,
        organization_type_id: 1,
        full_name: 'ООО "Компания 2"',
        short_name: 'Компания 2',
        phone: '+79517522363',
      },
      {
        organization_id: 3,
        organization_type_id: 1,
        full_name: 'ООО "Компания 3"',
        short_name: 'Компания 3',
        phone: '+79327544163',
      },
      {
        organization_id: 4,
        organization_type_id: 1,
        full_name: 'ООО "Компания 4"',
        short_name: 'Компания 4',
        phone: '+79354944154',
      },
      {
        organization_id: 5,
        organization_type_id: 1,
        full_name: 'ИП Иванов',
        short_name: 'ИП Иванов',
        phone: '+79587944132',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Organizations', null, {})
  },
}
