const db = require('../database/models')

exports.findByStrategy = (id) => {
  return db.aliases.findAll({
    where: {
      strategy_id: id
    },
    raw: true
  })
}
