
const SuggestionService = require('../services/suggestion-services')
const schema = require('./schema/index')

module.exports = class SuggestionController {
  static async read (req, res) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(500).send('Server Error!')
      }
      const suggestionsRead = await SuggestionService.read(id)
      if (!suggestionsRead) {
        return res.status(404).send({ success: false, message: 'Suggestion not found!' })
      }
      return res.status(200).send({ success: true, data: suggestionsRead })
    } catch (error) {
      console.log('🚀 ~ file: suggestion_controller.js:18 ~ SuggestionController ~ read ~ error:', error)
      return res.status(500).send({ success: false, message: 'Server Error!' })
    }
  }

  static async list (req, res) {
    try {
      const suggestionsList = await SuggestionService.list()
      return res.status(200).send({ success: true, data: suggestionsList })
    } catch (error) {
      console.log('🚀 ~ file: suggestion_controller.js:11 ~ SuggestionController ~ list ~ error:', error)
      return res.status(500).send({ success: false, message: 'Server Error!' })
    }
  }

  static async create (req, res) {
    try {
      const { user_info: user } = req
      const { error } = schema.suggestionCreate.validate({
        ...req.body
      })
      if (error) {
        return res.status(400).send(400, { success: false, message: error?.message })
      }
      const suggestionInsert = await SuggestionService.create({ ...req.body, username: user.username })

      if (!suggestionInsert) {
        return res.status(400).send({ success: false, message: 'Invalid suggestion!' })
      }
      return res.status(200).send({ success: true, data: suggestionInsert })
    } catch (error) {
      console.log('🚀 ~ file: suggestion_controller.js:13 ~ SuggestionController ~ create ~ error:', error)
      return res.status(500).send({ success: false, message: 'Server Error!' })
    }
  }

  static async delete (req, res) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(500).send('Server Error!')
      }
      const suggestionsDelete = await SuggestionService.delete(id)
      if (!suggestionsDelete) {
        return res.status(404).send({ success: false, message: 'Suggestion not found!' })
      }
      return res.status(200).send({ success: true, data: suggestionsDelete })
    } catch (error) {
      console.log('🚀 ~ file: suggestion_controller.js:66 ~ SuggestionController ~ delete ~ error:', error)
      return res.status(500).send({ success: false, message: 'Server Error!' })
    }
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
