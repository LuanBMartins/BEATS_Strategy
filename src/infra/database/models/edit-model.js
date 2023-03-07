module.exports = (sequelize, DataTypes) => {
    const edicao = sequelize.define('edicao', {
        administrador: {
            type: DataTypes.STRING(50),
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'username'
            },
            onDelete: 'CASCADE'
        },
        estrategia: {
            type: DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'estrategia_arquitetural',
                key: 'nome'
            },
            onDelete: 'CASCADE'
        },
        data_edicao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        }
    }, {
        timestamps: false,
        underscored: true,
        uniqueKeys: {
            unique_edicao: {
                fields: ['administrador', 'estrategia', 'data_edicao']
            }
        }
    });

    return edicao
}