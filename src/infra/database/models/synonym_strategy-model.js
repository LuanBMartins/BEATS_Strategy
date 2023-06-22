module.exports = (sequelize, DataTypes) => {
  const sinonimoEstrategia = sequelize.define('sinonimo_estrategia', {
    estrategia: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'estrategia_arquitetural',
        key: 'nome'
      },
      onDelete: 'CASCADE'
    },
    sinonimo: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true,
    primaryKey: true,
    uniqueKeys: {
      unique_sinonimo: {
        fields: ['estrategia', 'sinonimo']
      }
    }
  })

  return sinonimoEstrategia
}
