module.exports = (sequelize, DataTypes) => {
  const Suggestion = sequelize.define('suggestion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      references: {
        model: 'usuario',
        key: 'username'
      },
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reference: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'suggestion',
    timestamps: false
  })

  Suggestion.associate = (model) => {
    Suggestion.belongsTo(model.usuario, {
      foreignKey: {
        fieldName: 'username'
      }
    })
  }

  return Suggestion
}
