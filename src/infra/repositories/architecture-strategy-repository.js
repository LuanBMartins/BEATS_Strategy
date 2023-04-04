const db = require('../database/models')

exports.create = async (strategy) => {
  return db.architecture_strategy.create(strategy)
}

exports.update = async (id, strategy) => {
  return db.architecture_strategy.update(strategy, {
    where: {
      id
    }
  })
}
