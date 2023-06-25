const strategyServices = require('../../../services/strategy_services')
const strategyControllers = require('../../../controllers/strategy_controllers')

describe('strategyControllers', () => {
  describe('searchStrategies', () => {
    it('deve retornar as estratégias filtradas com sucesso (PATTERN)', async () => {
      const req = {
        query: {
          attr: ['c', 'i'],
          name: 'strategyName',
          type: 'PATTERN'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const strategies = [/* lista de estratégias */]

      jest.spyOn(strategyServices, 'getStrategiesFiltered').mockResolvedValue(strategies)

      await strategyControllers.searchStrategies(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ strategies })

      strategyServices.getStrategiesFiltered.mockRestore()
    })

    it('deve retornar as estratégias filtradas com sucesso (TACTIC)', async () => {
      const req = {
        query: {
          attr: ['c', 'i'],
          name: 'strategyName',
          type: 'TACTIC'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const strategies = [/* lista de estratégias */]

      jest.spyOn(strategyServices, 'getStrategiesFiltered').mockResolvedValue(strategies)

      await strategyControllers.searchStrategies(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ strategies })

      strategyServices.getStrategiesFiltered.mockRestore()
    })

    it('deve retornar um erro quando o atributo fornecido não existe', async () => {
      const req = {
        query: {
          attr: ['c', 'x', 'a'],
          name: 'strategyName',
          type: 'PATTERN'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await strategyControllers.searchStrategies(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "infosec attribute 'x' does not exist"
      })
    })

    it('deve retornar um erro quando o tipo de estratégia fornecido não existe', async () => {
      const req = {
        query: {
          attr: ['c', 'i'],
          name: 'strategyName',
          type: 'INVALID_TYPE'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      await strategyControllers.searchStrategies(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        error_message: "strategy type 'INVALID_TYPE' does not exist"
      })
    })

    it('deve retornar as estratégias filtradas com sucesso mesmo quando o tipo não é fornecido', async () => {
      const req = {
        query: {
          attr: ['c', 'i'],
          name: 'strategyName'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const strategies = [/* lista de estratégias */]

      jest.spyOn(strategyServices, 'getStrategiesFiltered').mockResolvedValue(strategies)

      await strategyControllers.searchStrategies(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({ strategies })

      strategyServices.getStrategiesFiltered.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        query: {
          attr: ['c', 'i'],
          name: 'strategyName',
          type: 'PATTERN'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(strategyServices, 'getStrategiesFiltered').mockRejectedValue(new Error('Erro no servidor'))

      await strategyControllers.searchStrategies(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Server Error!')

      strategyServices.getStrategiesFiltered.mockRestore()
    })
  })

  describe('getStrategy', () => {
    it('deve retornar a estratégia pelo ID com sucesso', async () => {
      const req = {
        params: { id: 'strategyId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }
      const strategy = { /* estratégia */ }

      jest.spyOn(strategyServices, 'getStrategiesById').mockResolvedValue(strategy)

      await strategyControllers.getStrategy(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(strategy)

      strategyServices.getStrategiesById.mockRestore()
    })

    it('deve retornar um erro quando a estratégia não existe', async () => {
      const req = {
        params: { id: 'strategyId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(strategyServices, 'getStrategiesById').mockResolvedValue(null)

      await strategyControllers.getStrategy(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error_message: 'strategy does not exist!'
      })

      strategyServices.getStrategiesById.mockRestore()
    })

    it('deve retornar um status de erro quando ocorre uma exceção', async () => {
      const req = {
        params: { id: 'strategyId' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      }

      jest.spyOn(strategyServices, 'getStrategiesById').mockRejectedValue(new Error('Erro no servidor'))

      await strategyControllers.getStrategy(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Server Error!')

      strategyServices.getStrategiesById.mockRestore()
    })
  })
})
