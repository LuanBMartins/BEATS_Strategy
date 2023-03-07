'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('architecture_strategy', {
      name: {
        type: Sequelize.STRING(100),
        primaryKey: true
      },
      type: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      c: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      i: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      a: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      authn: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      authz: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      acc: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      nr: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      username_creator: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'usuario',
          key: 'username'
        }
      },
      publish_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      problem: {
        type: Sequelize.TEXT
      },
      context: {
        type: Sequelize.TEXT
      },
      forces: {
        type: Sequelize.TEXT
      },
      solution: {
        type: Sequelize.TEXT
      },
      rationale: {
        type: Sequelize.TEXT
      },
      consequences: {
        type: Sequelize.TEXT
      },
      examples: {
        type: Sequelize.TEXT
      },
      related_strategies: {
        type: Sequelize.TEXT
      },
      complementary_references: {
        type: Sequelize.TEXT
      },
      accepted: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('architecture_strategy')
  }
}