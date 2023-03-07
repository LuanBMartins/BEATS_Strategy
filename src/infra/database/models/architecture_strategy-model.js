module.exports = (sequelize, DataTypes) => {
    const architectureStrategy = sequelize.define('architecture_strategy', {
        name: {
            type: DataTypes.STRING(100),
            primaryKey: true
        },
        type: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        c: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        i: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        a: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        authn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        authz: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        acc: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        nr: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        username_creator: {
            type: DataTypes.STRING(50),
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'username'
            }
        },
        publish_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        problem: {
            type: DataTypes.TEXT
        },
        context: {
            type: DataTypes.TEXT
        },
        forces: {
            type: DataTypes.TEXT
        },
        solution: {
            type: DataTypes.TEXT
        },
        rationale: {
            type: DataTypes.TEXT
        },
        consequences: {
            type: DataTypes.TEXT
        },
        examples: {
            type: DataTypes.TEXT
        },
        related_strategies: {
            type: DataTypes.TEXT
        },
        complementary_references: {
            type: DataTypes.TEXT
        },
        accepted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'architecture_strategy',
        timestamps: false
    });

    return architectureStrategy
}