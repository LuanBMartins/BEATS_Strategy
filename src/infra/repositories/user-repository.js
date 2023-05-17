const db = require('../database/models')

exports.findWithEmail = async (email) => {
  return db.usuario.findOne({
    where: {
      email
    },
    raw: true
  })
}

exports.updateProfileWithEmail = async (email, profile) => {
  return db.usuario.update(profile, {
    where: {
      email
    }
  })
}
