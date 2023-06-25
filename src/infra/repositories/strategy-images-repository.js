const db = require('../database/models')

exports.findById = (id) => {
  return db.strategy_image.findAll({
    where: {
      strategy_id: id
    }
  })
}
