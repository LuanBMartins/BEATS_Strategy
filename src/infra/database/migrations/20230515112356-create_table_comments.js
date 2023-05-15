'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('comment', {
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
      username: {
        type: Sequelize.STRING,
        references: {
          model: 'usuario',
          key: 'username'
        },
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      base_comment: {
        type: Sequelize.INTEGER,
        references: {
          model: 'comment',
          key: 'id'
        },
        allowNull: true
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('comment')
  }
}
