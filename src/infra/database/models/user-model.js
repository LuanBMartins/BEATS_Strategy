module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('usuario', {
    username: {
      type: DataTypes.STRING(50),
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    perfil_github: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    data_ingresso: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    tipo_usuario: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    status_ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'usuario',
    timestamps: false,
    underscored: true
  })

  user.associate = (models) => {
    user.hasMany(models.comment, {
      foreignKey: {
        fieldName: 'username'
      }
    })
  }

  return user
}
