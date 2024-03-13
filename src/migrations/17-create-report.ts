'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'order_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      file_sku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_alt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FileTypes',
          key: 'file_type_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      report_json: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Reports')
  },
}
