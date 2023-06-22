module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
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
    username: {
      type: DataTypes.STRING,
      references: {
        model: 'usuario',
        key: 'username'
      },
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    base_comment: {
      type: DataTypes.INTEGER,
      references: {
        model: 'comment',
        key: 'id'
      },
      allowNull: true
    }
  }, {
    tableName: 'comment',
    timestamps: false
  })

  comment.associate = (models) => {
    comment.belongsTo(models.architecture_strategy, {
      foreignKey: {
        fieldName: 'strategy_id'
      }
    })
    comment.belongsTo(models.usuario, {
      foreignKey: {
        fieldName: 'username'
      }
    })
    comment.hasMany(models.comment, {
      foreignKey: {
        fieldName: 'base_comment'
      },
      as: 'replies'
    })
    comment.belongsTo(models.comment, {
      foreignKey: {
        fieldName: 'base_comment'
      }
    })
  }

  return comment
}
