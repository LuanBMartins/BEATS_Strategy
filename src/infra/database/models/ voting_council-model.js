module.exports = (sequelize, DataTypes) => {
  const votacaoConselho = sequelize.define('votacao_conselho', {
    nro_protocolo_solicitacao: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'solicitacao',
        key: 'nro_protocolo'
      },
      onDelete: 'CASCADE'
    },
    nro_recorrencia: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1
    },
    nro_aceitar: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    nro_aceitar_com_sugestoes: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    nro_rejeitar: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    caminho_ata: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    timestamps: false
  })

  return votacaoConselho
}
