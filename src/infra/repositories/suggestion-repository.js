const db = require('../database/models')

exports.findAll = () => {
  return db.suggestion.findAll({
    raw: true
  })
}

exports.readId = (id) => {
  return db.suggestion.findOne({
    where: {
      id
    },
    raw: true
  })
}

exports.create = (suggestion) => {
  return db.suggestion.create(suggestion)
}

exports.delete = (id) => {
  return db.suggestion.destroy({
    where: {
      id
    }
  })
}
