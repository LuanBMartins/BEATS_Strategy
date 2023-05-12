'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('strategy_image', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      strategy_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'architecture_strategy',
          key: 'id'
        },
        allowNull: false
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('strategy_image')
  }
}
