const SuggestionService = require('../../../services/suggestion-services')
const SuggestionController = require('../../../controllers/suggestion_controller')
const schema = require('./../../schema/index')

describe('SuggestionController', () => {
  describe('read', () => {
    it('deve retornar a sugestão pelo ID com sucesso', async () => {
      const req = {
        params: { id: 'suggestionId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const suggestionsRead = { /* sugestão */ }

      jest.spyOn(SuggestionService, 'read').mockResolvedValue(suggestionsRead)

      await SuggestionController.read(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ success: true, data: suggestionsRead })

      SuggestionService.read.mockRestore()
    })

    it('deve retornar erro caso não exista ID', async () => {
      const req = {
        params: {}
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await SuggestionController.read(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Server Error!')
    })

    it('deve retornar um erro quando a sugestão não existe', async () => {
      const req = {
        params: { id: 'suggestionId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(SuggestionService, 'read').mockResolvedValue(null)

      await SuggestionController.read(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Suggestion not found!'
      })

      SuggestionService.read.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: { id: 'suggestionId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(SuggestionService, 'read').mockRejectedValue(new Error('Erro no servidor'))

      await SuggestionController.read(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error!'
      })

      SuggestionService.read.mockRestore()
    })
  })

  describe('list', () => {
    it('deve retornar a lista de sugestões com sucesso', async () => {
      const req = {}
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const suggestionsList = [/* lista de sugestões */]

      jest.spyOn(SuggestionService, 'list').mockResolvedValue(suggestionsList)

      await SuggestionController.list(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ success: true, data: suggestionsList })

      SuggestionService.list.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {}
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(SuggestionService, 'list').mockRejectedValue(new Error('Erro no servidor'))

      await SuggestionController.list(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error!'
      })

      SuggestionService.list.mockRestore()
    })
  })

  describe('create', () => {
    it('deve criar uma nova sugestão com sucesso', async () => {
      const req = {
        user_info: { username: 'username' },
        body: { /* dados da sugestão */ }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const suggestionInsert = { /* sugestão inserida */ }

      jest.spyOn(schema.suggestionCreate, 'validate').mockReturnValue({ error: null })
      jest.spyOn(SuggestionService, 'create').mockResolvedValue(suggestionInsert)

      await SuggestionController.create(req, res)

      expect(schema.suggestionCreate.validate).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ success: true, data: suggestionInsert })

      schema.suggestionCreate.validate.mockRestore()
      SuggestionService.create.mockRestore()
    })

    it('deve retornar um erro de validação quando os dados da sugestão são inválidos', async () => {
      const req = {
        user_info: { username: 'username' },
        body: { /* dados inválidos da sugestão */ }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const validationError = new Error('Erro de validação')

      jest.spyOn(schema.suggestionCreate, 'validate').mockReturnValue({ error: validationError })

      await SuggestionController.create(req, res)

      expect(schema.suggestionCreate.validate).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith(400, {
        success: false,
        message: validationError.message
      })

      schema.suggestionCreate.validate.mockRestore()
    })

    it('deve retornar um erro quando a sugestão não pode ser inserida', async () => {
      const req = {
        user_info: { username: 'username' },
        body: { /* dados da sugestão */ }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(schema.suggestionCreate, 'validate').mockReturnValue({ error: null })
      jest.spyOn(SuggestionService, 'create').mockResolvedValue(null)

      await SuggestionController.create(req, res)

      expect(schema.suggestionCreate.validate).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid suggestion!'
      })

      schema.suggestionCreate.validate.mockRestore()
      SuggestionService.create.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        user_info: { username: 'username' },
        body: { /* dados da sugestão */ }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(schema.suggestionCreate, 'validate').mockReturnValue({ error: null })
      jest.spyOn(SuggestionService, 'create').mockRejectedValue(new Error('Erro no servidor'))

      await SuggestionController.create(req, res)

      expect(schema.suggestionCreate.validate).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error!'
      })

      schema.suggestionCreate.validate.mockRestore()
      SuggestionService.create.mockRestore()
    })
  })

  describe('delete', () => {
    it('deve excluir a sugestão pelo ID com sucesso', async () => {
      const req = {
        params: { id: 'suggestionId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const suggestionsDelete = { /* sugestão excluída */ }

      jest.spyOn(SuggestionService, 'delete').mockResolvedValue(suggestionsDelete)

      await SuggestionController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ success: true, data: suggestionsDelete })

      SuggestionService.delete.mockRestore()
    })

    it('deve retornar erro caso não exista ID', async () => {
      const req = {
        params: {}
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await SuggestionController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Server Error!')
    })

    it('deve retornar um erro quando a sugestão não existe', async () => {
      const req = {
        params: { id: 'suggestionId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(SuggestionService, 'delete').mockResolvedValue(null)

      await SuggestionController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Suggestion not found!'
      })

      SuggestionService.delete.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: { id: 'suggestionId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(SuggestionService, 'delete').mockRejectedValue(new Error('Erro no servidor'))

      await SuggestionController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error!'
      })

      SuggestionService.delete.mockRestore()
    })
  })
})
