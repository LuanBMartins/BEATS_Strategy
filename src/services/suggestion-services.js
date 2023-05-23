const suggestionRepository = require('../infra/repositories/suggestion-repository')

module.exports = class SuggestionService {
  static async create (suggestion) {
    if (!suggestion) {
      return false
    }
    const suggestionInsert = await suggestionRepository.create(suggestion)
    return suggestionInsert
  }

  static async list () {
    return suggestionRepository.findAll()
  }

  static async read (id) {
    if (!id) {
      return false
    }
    return suggestionRepository.readId(id)
  }

  static async delete (id) {
    if (!id) {
      return false
    }
    return suggestionRepository.delete(id)
  }
}
