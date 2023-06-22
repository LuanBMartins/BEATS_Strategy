'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('solicitacao', 'estrategia_referente')
    await queryInterface.addColumn('solicitacao', 'strategy_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'architecture_strategy',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('solicitacao', 'estrategia_referente', {
      type: Sequelize.STRING(100),
      references: {
        model: 'estrategia_arquitetural',
        key: 'nome',
        onDelete: 'CASCADE'
      }
    })
    await queryInterface.removeColumn('solicitacao', 'architecture_strategy')
  }
}
