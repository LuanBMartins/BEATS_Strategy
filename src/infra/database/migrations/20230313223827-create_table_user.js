'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.createTable('user', {
    //   username: {
    //     type: Sequelize.STRING(50),
    //     primaryKey: true
    //   },
    //   email: {
    //     type: Sequelize.STRING(100),
    //     allowNull: false,
    //     unique: true
    //   },
    //   password: {
    //     type: Sequelize.STRING(100),
    //     allowNull: false
    //   },
    //   github: {
    //     type: Sequelize.STRING(100),
    //     allowNull: false,
    //     unique: true
    //   },
    //   registration_date: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    //   },
    //   user_type: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false,
    //     defaultValue: 0
    //   },
    //   isActive: {
    //     type: Sequelize.BOOLEAN,
    //     allowNull: false,
    //     defaultValue: true
    //   }
    // }, {
    //   timestamps: false,
    //   underscored: true
    // })
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.dropTable('user')
  }
}
