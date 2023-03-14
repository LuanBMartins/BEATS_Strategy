module.exports = (sequelize, DataTypes) => {
  const solicitacao = sequelize.define('solicitacao', {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'username',
        onDelete: 'CASCADE'
      }
    },
    data_solicitacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    tipo_solicitacao: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    nro_protocolo: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    estado: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    administrador: {
      type: DataTypes.STRING(50),
      references: {
        model: 'Usuario',
        key: 'username',
        onDelete: 'CASCADE'
      }
    },
    voto_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    texto_rejeicao: {
      type: DataTypes.STRING(500)
    },
    texto_edicao: {
      type: DataTypes.STRING(500)
    },
    strategy_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'architecture_strategy',
        key: 'id'
      },
      allowNull: false
    }
  }, {
    tableName: 'solicitacao',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['username', 'data_solicitacao']
      }
    ]
  })

  return solicitacao
}
