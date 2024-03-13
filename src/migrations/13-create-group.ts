'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      group_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      group_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Branches',
          key: 'branch_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      checkpoint_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Checkpoints',
          key: 'checkpoint_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      facility_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Facilities',
          key: 'facility_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('Groups')
  },
}
