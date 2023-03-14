'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.createTable('vote', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true
    //   },
    //   protocol_number: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'council_vote',
    //       key: 'id'
    //     }
    //   },
    //   recurrence_number: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false,
    //     defaultValue: 0
    //   },
    //   council_member: {
    //     type: Sequelize.STRING(50),
    //     allowNull: false,
    //     references: {
    //       model: 'user',
    //       key: 'username'
    //     }
    //   },
    //   vote: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false
    //   }
    // }, {
    //   timestamps: false,
    //   freezeTableName: true
    // })
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.dropTable('vote')
  }
}
