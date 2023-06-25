const requestServices = require('../../../services/request_services')
const requestControllers = require('../../../controllers/request_controllers')

describe('requestControllers', () => {
  describe('postAddRequestSaveJSON', () => {
    it('deve criar uma solicitação de adição de estratégia e retornar uma mensagem de sucesso', async () => {
      const req = {
        body: { },
        user_info: { },
        files: { }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(requestServices, 'createStrategyRequest').mockResolvedValue(true)

      await requestControllers.postAddRequestSaveJSON(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'success: strategy add request done'
      })

      requestServices.createStrategyRequest.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando não for possível criar a solicitação', async () => {
      const req = {
        body: { },
        user_info: { },
        files: { }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(requestServices, 'createStrategyRequest').mockResolvedValue(false)

      await requestControllers.postAddRequestSaveJSON(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Erro ao criar a solicitação!'
      })

      requestServices.createStrategyRequest.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        body: { },
        user_info: { },
        files: { }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(requestServices, 'createStrategyRequest').mockRejectedValue(new Error('Erro no servidor'))

      await requestControllers.postAddRequestSaveJSON(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Server Error!'
      })

      requestServices.createStrategyRequest.mockRestore()
    })
  })

  describe('followRequestsStatus', () => {
    it('deve retornar as solicitações do usuário e um status de sucesso', async () => {
      const req = {
        user_info: { username: 'usuario1' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const requests = []

      jest.spyOn(requestServices, 'getRequestsByUser').mockResolvedValue(requests)

      await requestControllers.followRequestsStatus(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ requests })

      requestServices.getRequestsByUser.mockRestore()
    })
  })

  describe('followRequestsWaitingApproval', () => {
    it('deve retornar as solicitações em espera de aprovação e um status de sucesso', async () => {
      const req = {
        user_info: { username: 'usuario1' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const requests = []

      jest.spyOn(requestServices, 'getRequetsWaitingStatus').mockResolvedValue(requests)

      await requestControllers.followRequestsWaitingApproval(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ requests })

      requestServices.getRequetsWaitingStatus.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        user_info: { username: 'usuario1' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(requestServices, 'getRequetsWaitingStatus').mockRejectedValue(new Error('Erro no servidor'))

      await requestControllers.followRequestsWaitingApproval(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Server Error!')

      requestServices.getRequetsWaitingStatus.mockRestore()
    })
  })

  describe('readRequestById', () => {
    it('deve retornar uma solicitação pelo ID e um status de sucesso', async () => {
      const req = {
        params: { id: 10 }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const request = { }

      jest.spyOn(requestServices, 'getRequestsById').mockResolvedValue(request)

      await requestControllers.readRequestById(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ request })

      requestServices.getRequestsById.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando o ID da solicitação não é válido', async () => {
      const req = {
        params: { id: 'idInválido' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await requestControllers.readRequestById(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith('Parametro inválido!')
    })

    it('deve retornar uma mensagem de erro quando a solicitação não é encontrada', async () => {
      const req = {
        params: { id: 10 }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(requestServices, 'getRequestsById').mockResolvedValue(false)

      await requestControllers.readRequestById(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Request not found!' })

      requestServices.getRequestsById.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: { id: 10 }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(requestServices, 'getRequestsById').mockRejectedValue(new Error('Erro no servidor'))

      await requestControllers.readRequestById(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Server Error!')

      requestServices.getRequestsById.mockRestore()
    })
  })

  describe('deleteRequest', () => {
    it('deve excluir uma solicitação pelo protocolo e retornar uma mensagem de sucesso', async () => {
      const req = {
        params: { protocol: 'protocolo' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const request = { delete: true }

      jest.spyOn(requestServices, 'deleteRequest').mockResolvedValue(request)

      await requestControllers.deleteRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'request has been removed!'
      })

      requestServices.deleteRequest.mockRestore()
    })

    it('deve retornar uma mensagem de erro quando o protocolo não é fornecido', async () => {
      const req = {
        params: { protocol: undefined }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await requestControllers.deleteRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Server Error'
      })
    })

    it('deve retornar uma mensagem de erro quando a solicitação não é encontrada', async () => {
      const req = {
        params: { protocol: 'protocolo' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const request = { delete: false }

      jest.spyOn(requestServices, 'deleteRequest').mockResolvedValue(request)

      await requestControllers.deleteRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Request not found!'
      })

      requestServices.deleteRequest.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: { protocol: 'protocolo' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(requestServices, 'deleteRequest').mockRejectedValue(new Error('Erro no servidor'))

      await requestControllers.deleteRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Server Error!'
      })

      requestServices.deleteRequest.mockRestore()
    })
  })
})
