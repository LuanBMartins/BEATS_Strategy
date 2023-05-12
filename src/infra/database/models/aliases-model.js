module.exports = (sequelize, DataTypes) => {
  const aliases = sequelize.define('aliases', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'aliases',
    timestamps: false
  })

  aliases.associate = (model) => {
    aliases.belongsTo(model.architecture_strategy, {
      foreignKey: {
        fieldName: 'strategy_id'
      },
      as: 'aliases'
    })
  }

  return aliases
}
