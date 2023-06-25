const SuggestionService = require('../../suggestion-services')
const SuggestionRepository = require('../../../infra/repositories/suggestion-repository')

jest.mock('../../../infra/repositories/suggestion-repository')

describe('SuggestionService', () => {
  describe('create', () => {
    it('should create a suggestion', async () => {
      const suggestion = { title: 'New Suggestion', description: 'Suggestion description' }
      const insertedSuggestion = { id: 1, ...suggestion }

      SuggestionRepository.create.mockResolvedValue(insertedSuggestion)

      const result = await SuggestionService.create(suggestion)

      expect(SuggestionRepository.create).toHaveBeenCalledWith(suggestion)
      expect(result).toEqual(insertedSuggestion)
    })

    it('should return false if suggestion is missing', async () => {
      const suggestion = null

      const result = await SuggestionService.create(suggestion)

      expect(SuggestionRepository.create).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('list', () => {
    it('should return all suggestions', async () => {
      const suggestions = [{ id: 1, title: 'Suggestion 1' }, { id: 2, title: 'Suggestion 2' }]

      SuggestionRepository.findAll.mockResolvedValue(suggestions)

      const result = await SuggestionService.list()

      expect(SuggestionRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(suggestions)
    })
  })

  describe('read', () => {
    it('should read a suggestion by ID', async () => {
      const id = 1
      const suggestion = { id: 1, title: 'Suggestion 1' }

      SuggestionRepository.readId.mockResolvedValue(suggestion)

      const result = await SuggestionService.read(id)

      expect(SuggestionRepository.readId).toHaveBeenCalledWith(id)
      expect(result).toEqual(suggestion)
    })

    it('should return false if ID is missing', async () => {
      const id = null

      const result = await SuggestionService.read(id)

      expect(SuggestionRepository.readId).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('delete', () => {
    it('should delete a suggestion by ID', async () => {
      const id = 1

      SuggestionRepository.delete.mockResolvedValue(true)

      const result = await SuggestionService.delete(id)

      expect(SuggestionRepository.delete).toHaveBeenCalledWith(id)
      expect(result).toBe(true)
    })

    it('should return false if ID is missing', async () => {
      const id = null

      const result = await SuggestionService.delete(id)

      expect(SuggestionRepository.delete).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })
})
