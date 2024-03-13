'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Checkpoints', {
      checkpoint_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      checkpoint_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lat: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      lng: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Branches',
          key: 'branch_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      neighboring_state_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'NeighboringStates',
          key: 'neighboring_state_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      district: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      region: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      checkpoint_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CheckpointTypes',
          key: 'checkpoint_type_id',
        },
      },
      working_hours_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'WorkingHours',
          key: 'working_hours_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      operating_mode_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OperatingModes',
          key: 'operating_mode_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      property_values: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [],
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
    await queryInterface.dropTable('Checkpoints')
  },
}
