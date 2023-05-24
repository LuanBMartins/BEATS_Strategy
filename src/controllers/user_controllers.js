const userService = require('../services/user_services')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = class ProfileControllers {
  static async readProfile (req, res) {
    try {
      const { email } = req.params
      if (!email) {
        return res.status(400).send({ success: false, message: 'Invalid Params!' })
      }
      const user = await userService.readUser(email)
      if (!user) {
        return res.status(404).send({ success: false, message: 'User not found!' })
      }
      return res.status(200).send({ success: true, data: user })
    } catch (error) {
      console.log('🚀 ~ file: user_controllers.js:19 ~ ProfileControllers ~ readProfile ~ error:', error)
      return res.status(500).send({ success: false, message: 'Server Error!' })
    }
  }

  static async updateProfile (req, res) {
    try {
      const { email } = req.params
      if (!email) {
        return res.status(400).send({ success: false, message: 'Invalid Params!' })
      }
      const profile = req.body
      const validPayload = ProfileControllers.validate(['username', 'email', 'senha', 'perfil_github'], profile)

      if (validPayload.senha && validPayload.senha.length < 12) {
        return res.status(400).send({ success: false, message: 'password must contain 12 digits' })
      }
      const updateProfile = await userService.updateProfile(email, validPayload)
      if (!updateProfile) {
        return res.status(200).send({ update: false })
      }
      return res.status(200).send({ update: true })
    } catch (error) {
      console.log('🚀 ~ file: user_controllers.js:37 ~ ProfileControllers ~ updateProfile ~ error:', error)
      return res.status(500).send({ success: false, message: 'Server Error!' })
    }
  }

  static async registerUser (req, res, next) {
    const username = req.body.username
    const email = req.body.email
    const github = req.body.github

    if (req.body.password.length !== 12) {
      return res.status(400).send({ error_message: 'password must contain 12 digits' })
    }
    const password = await bcrypt.hash(req.body.password, 10)

    const userInsert = await userService.insertUser(username, email, password, github)

    if (!userInsert) {
      return res.status(400).send({ error_message: 'username or email or github already in use' }) // WIP: separar
    }

    const tokenInfo = { username, user_type: 0 }
    const accessToken = jwt.sign(tokenInfo, process.env.JWT_SECRET)

    res.status(200).send({
      message: 'success: registered',
      access_token: accessToken,
      username,
      user_type: 'Regular User'
    })
  }

  static async authenticateUser (req, res, next) {
    const username = req.body.username
    const password = req.body.password

    if (password.length !== 12) {
      return res.status(400).send({ error_message: 'password must contain 12 digits' })
    }

    const user = await userService.getUser(username)
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).send({ error_message: 'username or password is incorrect' })
    }

    const tokenInfo = { username: user.username, user_type: user.user_type }
    const accessToken = jwt.sign(tokenInfo, process.env.JWT_SECRET)

    res.status(200).send({
      message: 'success: logged in',
      access_token: accessToken,
      username,
      user_type: ['Regular User', 'Council Member', 'Administrator'][user.user_type]
    })
  }

  /**
     * @abstract Remove campos indesejados
     * @param fields
     * @param object
     * @returns
     */
  static validate (fields, object) {
    if (!object) {
      return {}
    }
    const newObjet = {}
    Object.getOwnPropertyNames(object)
      .filter(key => fields.includes(key))
      .forEach(key => {
        // eslint-disable-next-line no-return-assign
        return newObjet[key] = object[key]
      })
    return newObjet
  }
}
