const db = require('../database/models')


exports.create = async (strategy) => {
    return db.architecture_strategy.create(strategy)
}
