const db = require('../../database/models')
const SuggestionRepository = require('../suggestion-repository')

jest.mock('../../database/models')

describe('SuggestionRepository', () => {
  describe('findAll', () => {
    it('should find all suggestions', async () => {
      const suggestions = [
        { id: 1, title: 'Suggestion 1', content: 'Content 1' },
        { id: 2, title: 'Suggestion 2', content: 'Content 2' }
      ]

      db.suggestion.findAll.mockResolvedValue(suggestions)

      const result = await SuggestionRepository.findAll()

      expect(db.suggestion.findAll).toHaveBeenCalledWith({ raw: true })
      expect(result).toEqual(suggestions)
    })
  })

  describe('readId', () => {
    it('should find a suggestion by ID', async () => {
      const id = 1
      const suggestion = { id, title: 'Suggestion', content: 'Content' }

      db.suggestion.findOne.mockResolvedValue(suggestion)

      const result = await SuggestionRepository.readId(id)

      const expectedWhere = { id }

      expect(db.suggestion.findOne).toHaveBeenCalledWith({
        where: expectedWhere,
        raw: true
      })
      expect(result).toEqual(suggestion)
    })
  })

  describe('create', () => {
    it('should create a new suggestion', async () => {
      const suggestion = { title: 'New Suggestion', content: 'New Content' }

      const createdSuggestion = { id: 1, ...suggestion }

      db.suggestion.create.mockResolvedValue(createdSuggestion)

      const result = await SuggestionRepository.create(suggestion)

      expect(db.suggestion.create).toHaveBeenCalledWith(suggestion)
      expect(result).toEqual(createdSuggestion)
    })
  })

  describe('delete', () => {
    it('should delete a suggestion by ID', async () => {
      const id = 1

      db.suggestion.destroy.mockResolvedValue(1)

      const result = await SuggestionRepository.delete(id)

      const expectedWhere = { id }

      expect(db.suggestion.destroy).toHaveBeenCalledWith({
        where: expectedWhere
      })
      expect(result).toEqual(1)
    })
  })
})
