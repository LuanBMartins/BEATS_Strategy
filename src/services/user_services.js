const dbClient = require('../dbconfig').db_client
const userRepository = require('../infra/repositories/user-repository')
const bcrypt = require('bcrypt')

module.exports = class profileServices {
  static async readUser (email) {
    if (!email) {
      return false
    }
    const user = await userRepository.findWithEmail(email)
    return user
  }

  static async updateProfile (email, payload) {
    if (!email) return false

    if (payload.senha) {
      payload.senha = await bcrypt.hash(payload.senha, 10)
    } else {
      delete payload.senha
    }
    return await userRepository.updateProfileWithEmail(email, payload)
  }

  static async getUser (identifier) {
    try {
      // eslint-disable-next-line no-multi-str
      const text = 'SELECT username, email, senha AS password,\
            perfil_github AS github, data_ingresso AS registration_date,\
            tipo_usuario AS user_type, status_ativo AS isActive\
            FROM usuario\
            WHERE username = $1 OR email = $1 OR perfil_github = $1'
      const values = [identifier]

      const dbUser = await dbClient.query(text, values)

      if (dbUser.rowCount === 0) {
        return null
      }

      return dbUser.rows[0]
    } catch (err) {
      console.log(err)
      return false
    }
  }

  static async insertUser (username, email, password, github) {
    try {
      // eslint-disable-next-line no-multi-str
      const text = 'INSERT INTO usuario (username, email, senha, perfil_github)\
            VALUES ($1, $2, $3, $4)\
            RETURNING username, email, perfil_github AS github,\
            data_ingresso AS registration_date, tipo_usuario AS user_type'
      const values = [username, email, password, github]

      const userInserted = await dbClient.query(text, values)

      return userInserted.rows[0]
    } catch (err) {
      if (err.code === '23505') {
        return null
      }
      console.log(err)
      return false
    }
  }

  static async getNumberCouncilMembers () {
    try {
      const text = 'SELECT COUNT(*) AS number_council_members FROM usuario WHERE tipo_usuario = 1'
      const dbCouncilMembersNumber = await dbClient.query(text)

      return dbCouncilMembersNumber.rows[0].number_council_members
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
