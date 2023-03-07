module.exports = (sequelize, DataTypes) => {

    const voto = sequelize.define('voto', {
        nro_protocolo_solicitacao: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'votacao_conselho',
                key: 'nro_protocolo_solicitacao'
            }
        },
        nro_recorrencia: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
        membro_conselho: {
            type: DataTypes.STRING(50),
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'username'
            }
        },
        voto_opcao: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return voto
}