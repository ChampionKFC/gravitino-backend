'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('RolePermissions', [
      {
        role_permission_id: 2,
        role_id: 4,
        permission_id: 62,
        rights: true,
      },
      {
        role_permission_id: 3,
        role_id: 4,
        permission_id: 70,
        rights: true,
      },
      {
        role_permission_id: 4,
        role_id: 4,
        permission_id: 71,
        rights: true,
      },
      {
        role_permission_id: 5,
        role_id: 4,
        permission_id: 72,
        rights: true,
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('RolePermissions', null, {})
  },
}
