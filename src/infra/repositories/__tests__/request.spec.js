const db = require('../../database/models')
const RequestRepository = require('../requests-repository')

jest.mock('../../database/models')

describe('RequestRepository', () => {
  describe('create', () => {
    it('should create a new request', async () => {
      const request = { data: 'New request' }
      const createdRequest = { id: 1, data: 'New request' }

      db.solicitacao.create.mockResolvedValue(createdRequest)

      const result = await RequestRepository.create(request)

      expect(db.solicitacao.create).toHaveBeenCalledWith(request)
      expect(result).toEqual(createdRequest)
    })
  })

  describe('getRequetsWaitingStatus', () => {
    it('should retrieve requests with waiting status', async () => {
      const requests = [
        { id: 1, data: 'Request 1' },
        { id: 2, data: 'Request 2' }
      ]

      db.solicitacao.findAll.mockResolvedValue(requests)

      const result = await RequestRepository.getRequetsWaitingStatus()

      const expectedWhere = { estado: 0 }

      expect(db.solicitacao.findAll).toHaveBeenCalledWith({
        attributes: [
          ['username', 'author'],
          ['data_solicitacao', 'date_required'],
          ['tipo_solicitacao', 'type'],
          ['nro_protocolo', 'protocol_number'],
          ['estado', 'state'],
          ['administrador', 'administrator'],
          ['voto_admin', 'admin_vote'],
          ['texto_rejeicao', 'rejection_text'],
          ['texto_edicao', 'edit_text'],
          ['strategy_id', 'relating_strategy'],
          'architecture_strategy.name'
        ],
        where: expectedWhere,
        include: { attributes: [], model: db.architecture_strategy },
        raw: true
      })

      expect(result).toEqual(requests)
    })
  })

  describe('getRequestsByUsername', () => {
    it('should retrieve requests by username', async () => {
      const username = 'john_doe'
      const requests = [
        { id: 1, data: 'Request 1' },
        { id: 2, data: 'Request 2' }
      ]

      db.solicitacao.findAll.mockResolvedValue(requests)

      const result = await RequestRepository.getRequestsByUsername(username)

      const expectedWhere = { username }

      expect(db.solicitacao.findAll).toHaveBeenCalledWith({
        attributes: [
          ['username', 'author'],
          ['data_solicitacao', 'date_required'],
          ['tipo_solicitacao', 'type'],
          ['nro_protocolo', 'protocol_number'],
          ['estado', 'state'],
          ['administrador', 'administrator'],
          ['voto_admin', 'admin_vote'],
          ['texto_rejeicao', 'rejection_text'],
          ['texto_edicao', 'edit_text'],
          ['strategy_id', 'relating_strategy'],
          'architecture_strategy.name'
        ],
        where: expectedWhere,
        include: { attributes: [], model: db.architecture_strategy },
        raw: true
      })

      expect(result).toEqual(requests)
    })
  })

  describe('getRequestsByProtocol', () => {
    it('should retrieve a request by protocol number', async () => {
      const protocol = '12345'
      const request = { id: 1, data: 'Request' }

      db.solicitacao.findOne.mockResolvedValue(request)

      const result = await RequestRepository.getRequestsByProtocol(protocol)

      const expectedWhere = { nro_protocolo: protocol }

      expect(db.solicitacao.findOne).toHaveBeenCalledWith({
        attributes: [
          ['username', 'author'],
          ['data_solicitacao', 'date_required'],
          ['tipo_solicitacao', 'type'],
          ['nro_protocolo', 'protocol_number'],
          ['estado', 'state'],
          ['administrador', 'administrator'],
          ['voto_admin', 'admin_vote'],
          ['texto_rejeicao', 'rejection_text'],
          ['texto_edicao', 'edit_text'],
          ['strategy_id', 'relating_strategy']
        ],
        where: expectedWhere,
        include: { attributes: ['id'], model: db.architecture_strategy }
      })

      expect(result).toEqual(request)
    })
  })

  describe('deleteRequest', () => {
    it('should delete a request by protocol number', async () => {
      const protocol = '12345'

      db.solicitacao.destroy.mockResolvedValue(1)

      const result = await RequestRepository.deleteRequest(protocol)

      const expectedWhere = { nro_protocolo: protocol }

      expect(db.solicitacao.destroy).toHaveBeenCalledWith({
        where: expectedWhere
      })

      expect(result).toEqual(1)
    })
  })

  describe('getById', () => {
    it('should retrieve a request by ID', async () => {
      const id = 1
      const request = { get: () => ({ id: 1, data: 'Request' }) }

      db.solicitacao.findOne.mockResolvedValue(request)

      const result = await RequestRepository.getById(id)

      const expectedWhere = { strategy_id: id }

      expect(db.solicitacao.findOne).toHaveBeenCalledWith({
        where: expectedWhere,
        include: { model: db.architecture_strategy }
      })

      expect(result).toEqual({ id: 1, data: 'Request' })
    })
  })

  describe('update', () => {
    it('should update a request by protocol number', async () => {
      const protocol = '12345'
      const vote = { approved: true }

      db.solicitacao.update.mockResolvedValue(1)

      const result = await RequestRepository.update(protocol, vote)

      const expectedWhere = { nro_protocolo: protocol }

      expect(db.solicitacao.update).toHaveBeenCalledWith(vote, {
        where: expectedWhere
      })

      expect(result).toEqual(1)
    })
  })
})
