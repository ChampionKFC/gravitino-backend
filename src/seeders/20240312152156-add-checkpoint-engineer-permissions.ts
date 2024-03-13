'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('RolePermissions', [
      {
        role_permission_id: 9,
        role_id: 2,
        permission_id: 62,
        rights: true,
      },
      {
        role_permission_id: 10,
        role_id: 2,
        permission_id: 71,
        rights: true,
      },
      {
        role_permission_id: 11,
        role_id: 2,
        permission_id: 72,
        rights: true,
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('RolePermissions', null, {})
  },
}
