'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'creator_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })

    await queryInterface.changeColumn('Orders', 'order_description', {
      type: Sequelize.TEXT,
      allowNull: true,
    })

    await queryInterface.changeColumn('Orders', 'executor_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })

    await queryInterface.changeColumn('Orders', 'planned_datetime', {
      type: Sequelize.DATE,
      allowNull: true,
    })

    await queryInterface.changeColumn('Orders', 'task_end_datetime', {
      type: Sequelize.DATE,
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'creator_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })

    await queryInterface.changeColumn('Orders', 'order_description', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.changeColumn('Orders', 'executor_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })

    await queryInterface.changeColumn('Orders', 'planned_datetime', {
      type: Sequelize.DATE,
      allowNull: false,
    })

    await queryInterface.changeColumn('Orders', 'task_end_datetime', {
      type: Sequelize.DATE,
      allowNull: false,
    })
  },
}
