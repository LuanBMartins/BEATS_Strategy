module.exports = (sequelize, DataTypes) => {
    const comentario = sequelize.define('comentario', {
        username: {
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
        data_comentario: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        texto: {
            type: DataTypes.STRING(280),
            allowNull: true
        },
        comentario_base: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'comentario',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    }, {
        timestamps: false,
        underscored: true,
        uniqueKeys: {
            unique_comentario: {
                fields: ['username', 'estrategia', 'data_comentario']
            }
        }
    });

    return comentario
}