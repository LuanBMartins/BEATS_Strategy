const db = require('../database/models')
const { Sequelize } = require('../database/models')
const { Op } = require('sequelize')

exports.findById = (id) => {
  return db.architecture_strategy.findOne({
    where: {
      id
    },
    raw: true
  })
}

exports.create = async (strategy) => {
  return db.architecture_strategy.create(strategy, {
    include: [{
      model: db.strategy_image,
      as: 'images'
    }, {
      model: db.aliases,
      as: 'aliases'
    }]
  })
}

exports.update = async (id, strategy) => {
  return db.architecture_strategy.update(strategy, {
    where: {
      id
    }
  })
}

exports.pagination = async (name, type, attributes) => {
  const querysFilter = ['name']
  const attributesFilter = ['c', 'i', 'a', 'authn', 'authz', 'acc', 'nr']
  return db.architecture_strategy.findAndCountAll({
    where: {
      ...fieldValidate({ name }, querysFilter),
      ...formattedOrFilters(attributes, attributesFilter),
      type,
      accepted: 1
    },
    raw: true
  })
}

function formattedOrFilters (querys, fields) {
  const arrayOfattributes = []
  for (const [key, value] of Object.entries(querys)) {
    if (value && fields.includes(key)) {
      arrayOfattributes.push({
        [key]: value
      })
    }
  }
  if (arrayOfattributes.length < 1) {
    return {}
  }
  return {
    [Op.or]: arrayOfattributes
  }
}

/**
 * @abstract Retorna uma objeto contendo somentes campos válidos
 * @param querys
 * @returns
 */
function fieldValidate (querys, fields) {
  const validObjet = {}
  for (const [key, value] of Object.entries(querys)) {
    if (value && fields.includes(key)) {
      validObjet[key] = fieldQuerysFilters(value)[key] || value
    }
  }
  return validObjet
}

/**
 * @abstract Retorna uma filtragem personalizada por campo
 * @param field
 * @returns
 */
function fieldQuerysFilters (field) {
  return {
    name: Sequelize.where(
      Sequelize.fn('UPPER', Sequelize.col('name')),
      {
        [Sequelize.Op.like]: `%${field.toUpperCase()}%`
      }
    )
  }
}
