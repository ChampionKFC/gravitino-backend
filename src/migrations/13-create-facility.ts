'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Facilities', {
      facility_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      facility_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      organization_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
      },
      checkpoint_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Checkpoints',
          key: 'checkpoint_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      facility_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FacilityTypes',
          key: 'facility_type_id',
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
    await queryInterface.dropTable('Facilities')
  },
}
