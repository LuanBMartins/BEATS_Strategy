const db = require('../database/models')

exports.findById = (id) => {
  return db.strategy_image.findAll({
    where: {
      strategy_id: id
    }
  })
}

// function formattedOrFilters (querys, fields) {
//   const arrayOfattributes = []
//   for (const [key, value] of Object.entries(querys)) {
//     if (value && fields.includes(key)) {
//       arrayOfattributes.push({
//         [key]: value
//       })
//     }
//   }
//   if (arrayOfattributes.length < 1) {
//     return {}
//   }
//   return {
//     [Op.or]: arrayOfattributes
//   }
// }

// /**
//  * @abstract Retorna uma objeto contendo somentes campos válidos
//  * @param querys
//  * @returns
//  */
// function fieldValidate (querys, fields) {
//   const validObjet = {}
//   for (const [key, value] of Object.entries(querys)) {
//     if (value && fields.includes(key)) {
//       validObjet[key] = fieldQuerysFilters(value)[key] || value
//     }
//   }
//   return validObjet || {}
// }

// /**
//  * @abstract Retorna uma filtragem personalizada por campo
//  * @param field
//  * @returns
//  */
// function fieldQuerysFilters (field) {
//   return {
//     name: Sequelize.where(
//       Sequelize.fn('UPPER', Sequelize.col('name')),
//       {
//         [Sequelize.Op.like]: `%${field.toUpperCase()}%`
//       }
//     )
//   }
// }
