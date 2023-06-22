'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.createTable('council_vote', {
    //   id: {
    //     type: INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true
    //   },
    //   protocol_number: {
    //     type: INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'request',
    //       key: 'id'
    //     },
    //     onDelete: 'CASCADE'
    //   },
    //   recurrence_number: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false,
    //     defaultValue: 1
    //   },
    //   accept_count: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false,
    //     defaultValue: 0
    //   },
    //   accept_with_suggestions_count: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false,
    //     defaultValue: 0
    //   },
    //   reject_count: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false,
    //     defaultValue: 0
    //   },
    //   directory_ata: {
    //     type: Sequelize.STRING(255),
    //     allowNull: false
    //   }
    // }, {
    //   timestamps: false
    // })
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.dropTable('council_vote')
  }
}
