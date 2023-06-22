module.exports = (sequelize, DataTypes) => {
  const strategyImage = sequelize.define('strategy_image', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    strategy_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'architecture_strategy',
        key: 'id'
      },
      allowNull: false
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'strategy_image',
    timestamps: false
  })

  strategyImage.associate = (model) => {
    strategyImage.belongsTo(model.architecture_strategy, {
      foreignKey: {
        fieldName: 'strategy_id'
      },
      as: 'images'
    })
  }

  return strategyImage
}
