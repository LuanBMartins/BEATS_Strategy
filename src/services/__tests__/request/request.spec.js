/* eslint-disable no-unused-expressions */
const RequestServices = require('./../../request_services')
const RequestRepository = require('../../../infra/repositories/requests-repository')
const StrategyRepository = require('../../../infra/repositories/architecture-strategy-repository')
const ImagesRepository = require('../../../infra/repositories/strategy-images-repository')
const AliasesRepository = require('../../../infra/repositories/aliases-repository')
const imagesFile = require('./../../utils/getFile')

jest.mock('../../../infra/repositories/requests-repository')
jest.mock('../../../infra/repositories/architecture-strategy-repository')
jest.mock('../../../infra/repositories/strategy-images-repository')
jest.mock('../../../infra/repositories/aliases-repository')
jest.mock('../../../controllers/utils/validate')
jest.mock('./../../utils/getFile')
jest.mock('fs').promises

describe('RequestServices', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createStrategyRequest', () => {
    it('should create a strategy request', async () => {
      const strategy = {
        id: 1,
        name: 'Strategy 1',
        type: 'tactic',
        aliases: '[{"name": "Alias 1"}]',
        images: []
      }
      const files = [{ filename: 'image1.png' }, { filename: 'image2.png' }]
      const auth = { username: 'JohnDoe' }

      const strategyCreate = { id: 1, name: 'Strategy 1', type: 1, aliases: [{ name: 'Alias 1' }], images: files.map(file => ({ origin: file.filename })) }
      const requestCreate = { id: 1, username: 'JohnDoe', tipo_solicitacao: 1, estado: 0, strategy_id: 1 }

      StrategyRepository.create.mockResolvedValue({ dataValues: strategyCreate })
      RequestRepository.create.mockResolvedValue(requestCreate)

      const result = await RequestServices.createStrategyRequest(strategy, files, auth)

      expect(StrategyRepository.create).toHaveBeenCalledWith({ ...strategy, username_creator: 'JohnDoe' })
      expect(RequestRepository.create).toHaveBeenCalledWith({ username: 'JohnDoe', tipo_solicitacao: 1, estado: 0, strategy_id: 1 })
      expect(result).toEqual({ requestCreate, strategyCreate })
    })

    it('should return false if strategy creation fails', async () => {
      const strategy = {
        id: 1,
        name: 'Strategy 1',
        type: 'tactic',
        aliases: '[{"name": "Alias 1"}]',
        images: []
      }
      const files = [{ filename: 'image1.png' }, { filename: 'image2.png' }]
      const auth = { username: 'JohnDoe' }

      StrategyRepository.create.mockResolvedValue(null)

      const result = await RequestServices.createStrategyRequest(strategy, files, auth)

      expect(StrategyRepository.create).toHaveBeenCalledWith({ ...strategy, username_creator: 'JohnDoe' })
      expect(RequestRepository.create).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should return false if an error occurs', async () => {
      const strategy = {
        id: 1,
        name: 'Strategy 1',
        type: 'tactic',
        aliases: '[{"name": "Alias 1"}]',
        images: []
      }
      const files = [{ filename: 'image1.png' }, { filename: 'image2.png' }]
      const auth = { username: 'JohnDoe' }

      StrategyRepository.create.mockRejectedValue(new Error('Strategy creation failed'))

      const result = await RequestServices.createStrategyRequest(strategy, files, auth)

      expect(StrategyRepository.create).toHaveBeenCalledWith({ ...strategy, username_creator: 'JohnDoe' })
      expect(RequestRepository.create).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('getRequestsById', () => {
    it('should return the request by ID with aliases and images', async () => {
      const id = 1
      const request = { id: 1, architecture_strategy: {} }
      const aliases = [{ name: 'Alias 1' }]
      const imagesByStrategy = [{ origin: 'image1.png' }, { origin: 'image2.png' }]
      const images = [{ file: 'image' }, { file: 'image' }]

      RequestRepository.getById.mockResolvedValue(request)
      AliasesRepository.findByStrategy.mockResolvedValue(aliases)
      ImagesRepository.findById.mockResolvedValue(imagesByStrategy)
      imagesFile.getImageFile.mockResolvedValue('image')

      const expectedResult = { ...request, architecture_strategy: { aliases, images } }

      const result = await RequestServices.getRequestsById(id)

      expect(RequestRepository.getById).toHaveBeenCalledWith(id)
      expect(AliasesRepository.findByStrategy).toHaveBeenCalledWith(id)
      expect(ImagesRepository.findById).toHaveBeenCalledWith(id)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('getRequestByProtocolNumber', () => {
    it('should return the request by protocol number', async () => {
      const requestProtocolNumber = '12345'
      const requestStrategy = { id: 1, name: 'Strategy 1' }

      RequestRepository.getRequestsByProtocol.mockResolvedValue({ get: jest.fn().mockReturnValue(requestStrategy) })

      const result = await RequestServices.getRequestByProtocolNumber(requestProtocolNumber)

      expect(RequestRepository.getRequestsByProtocol).toHaveBeenCalledWith(requestProtocolNumber)
      expect(result).toEqual(requestStrategy)
    })
  })

  describe('updateRequestState', () => {
    it('should update the request state', async () => {
      const id = 1
      const strategy = { name: 'Updated Strategy' }

      StrategyRepository.update.mockResolvedValue([1])

      const result = await RequestServices.updateRequestState(id, strategy)

      expect(StrategyRepository.update).toHaveBeenCalledWith(id, strategy)
      expect(result).toBe(true)
    })

    it('should return false if the update fails', async () => {
      const id = 1
      const strategy = { name: 'Updated Strategy' }

      StrategyRepository.update.mockResolvedValue([0])

      const result = await RequestServices.updateRequestState(id, strategy)

      expect(StrategyRepository.update).toHaveBeenCalledWith(id, strategy)
      expect(result).toBe(false)
    })
  })

  describe('getRequestByProtocol', () => {
    it('should return the requests by protocol', async () => {
      const protocol = '12345'
      const requests = [{ id: 1, name: 'Request 1' }, { id: 2, name: 'Request 2' }]

      RequestRepository.getRequestsByProtocol.mockResolvedValue(requests)

      const result = await RequestServices.getRequestByProtocol(protocol)

      expect(RequestRepository.getRequestsByProtocol).toHaveBeenCalledWith(protocol)
      expect(result).toEqual(requests)
    })
  })

  describe('getRequestsByUser', () => {
    it('should return the requests by username', async () => {
      const username = 'JohnDoe'
      const requests = [{ id: 1, name: 'Request 1' }, { id: 2, name: 'Request 2' }]

      RequestRepository.getRequestsByUsername.mockResolvedValue(requests)

      const result = await RequestServices.getRequestsByUser(username)

      expect(RequestRepository.getRequestsByUsername).toHaveBeenCalledWith(username)
      expect(result).toEqual(requests)
    })
  })

  describe('getRequetsWaitingStatus', () => {
    it('should return the requests with waiting status', async () => {
      const requests = [{ id: 1, name: 'Request 1' }, { id: 2, name: 'Request 2' }]

      RequestRepository.getRequetsWaitingStatus.mockResolvedValue(requests)

      const result = await RequestServices.getRequetsWaitingStatus()

      expect(RequestRepository.getRequetsWaitingStatus).toHaveBeenCalled()
      expect(result).toEqual(requests)
    })
  })

  describe('deleteRequest', () => {
    it('should delete the request', async () => {
      const protocol = 'b79cb3ba-745e-5d9a-8903-4a02327a7e09'

      const validateUuid = jest.fn().mockReturnValue(true)
      const deleteResult = 1

      require('uuid').validate = validateUuid
      RequestRepository.deleteRequest.mockResolvedValue(deleteResult)

      const result = await RequestServices.deleteRequest(protocol)

      expect(result).toEqual({ delete: true })
    })

    it('should return false if the protocol is invalid', async () => {
      const protocol = '1'

      const validateUuid = jest.fn().mockReturnValue(false)

      require('uuid').validate = validateUuid

      const result = await RequestServices.deleteRequest(protocol)
      expect(result).toEqual(false)
    })
  })
})
