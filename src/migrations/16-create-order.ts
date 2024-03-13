'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      order_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks',
          key: 'task_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_name: {
        type: Sequelize.STRING,
      },
      order_description: {
        type: Sequelize.STRING,
      },
      facility_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Facilities',
          key: 'facility_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      executor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Organizations',
          key: 'organization_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      completed_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderStatuses',
          key: 'order_status_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      planned_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      task_end_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ended_at_datetime: {
        type: Sequelize.DATE,
      },
      closed_at_datetime: {
        type: Sequelize.DATE,
      },
      priority_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderPriorities',
          key: 'priority_id',
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
    await queryInterface.dropTable('Orders')
  },
}
