'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.createTable('comment', {
    //   id: {
    //     type: Sequelize.UUID,
    //     defaultValue: Sequelize.UUIDV4,
    //     primaryKey: true
    //   },
    //   username: {
    //     type: Sequelize.STRING(50),
    //     allowNull: false,
    //     references: {
    //       model: 'user',
    //       key: 'username'
    //     },
    //     onDelete: 'CASCADE'
    //   },
    //   strategy: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'architecture_strategy',
    //       key: 'id'
    //     },
    //     onDelete: 'CASCADE'
    //   },
    //   comment_date: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    //   },
    //   text: {
    //     type: Sequelize.STRING(280),
    //     allowNull: true
    //   },
    //   reply_text: {
    //     type: Sequelize.UUID,
    //     allowNull: true,
    //     references: {
    //       model: 'comment',
    //       key: 'id'
    //     },
    //     onDelete: 'CASCADE'
    //   }
    // }, {
    //   timestamps: false,
    //   underscored: true
    // })
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.dropTable('comment')
  }
}
