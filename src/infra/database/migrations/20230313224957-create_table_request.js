'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.createTable('request', {
    //   id: {
    //     primaryKey: true,
    //     autoIncrement: true,
    //     type: Sequelize.INTEGER
    //   },
    //   username: {
    //     type: Sequelize.STRING(50),
    //     allowNull: false,
    //     references: {
    //       model: 'user',
    //       key: 'username',
    //       onDelete: 'CASCADE'
    //     }
    //   },
    //   application_date: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    //   },
    //   type: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false
    //   },
    //   nro_protocolo: {
    //     type: Sequelize.UUID,
    //     defaultValue: Sequelize.UUIDV4
    //   },
    //   state: {
    //     type: Sequelize.SMALLINT,
    //     allowNull: false,
    //     defaultValue: 0
    //   },
    //   administrator: {
    //     type: Sequelize.STRING(50),
    //     references: {
    //       model: 'user',
    //       key: 'username',
    //       onDelete: 'CASCADE'
    //     }
    //   },
    //   admin_vote: {
    //     type: Sequelize.BOOLEAN,
    //     allowNull: true
    //   },
    //   rejection_text: {
    //     type: Sequelize.STRING(500)
    //   },
    //   text_edit: {
    //     type: Sequelize.STRING(500)
    //   },
    //   relating_strategy: {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: 'architecture_strategy',
    //       key: 'id',
    //       onDelete: 'CASCADE'
    //     }
    //   }
    // }, {
    //   tableName: 'request',
    //   timestamps: false,
    //   indexes: [
    //     {
    //       unique: true,
    //       fields: ['username']
    //     }
    //   ]
    // })
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.dropTable('request')
  }
}
