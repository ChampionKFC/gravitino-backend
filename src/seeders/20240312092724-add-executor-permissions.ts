'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('RolePermissions', [
      {
        role_permission_id: 1,
        role_id: 1,
        permission_id: 62,
        rights: true,
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('RolePermissions', null, {})
  },
}
