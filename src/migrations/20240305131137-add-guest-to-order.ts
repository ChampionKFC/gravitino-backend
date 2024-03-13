'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'guest_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Guests',
        key: 'guest_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Orders', 'guest_id')
  },
}
