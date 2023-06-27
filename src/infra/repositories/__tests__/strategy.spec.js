const db = require('../../database/models')
const StrategyRepository = require('../architecture-strategy-repository')

jest.mock('../../database/models')

describe('StrategyRepository', () => {
  describe('findById', () => {
    it('should find strategy by ID', async () => {
      const strategyId = 1
      const strategy = { id: 1, name: 'Strategy 1' }

      db.architecture_strategy.findOne.mockResolvedValue(strategy)

      const result = await StrategyRepository.findById(strategyId)

      expect(db.architecture_strategy.findOne).toHaveBeenCalledWith({
        where: { id: strategyId },
        raw: true
      })
      expect(result).toEqual(strategy)
    })
  })

  describe('create', () => {
    it('should create a new strategy', async () => {
      const strategy = { name: 'New Strategy' }
      const createdStrategy = { id: 1, name: 'New Strategy' }

      db.architecture_strategy.create.mockResolvedValue(createdStrategy)

      const result = await StrategyRepository.create(strategy)

      expect(db.architecture_strategy.create).toHaveBeenCalledWith(strategy, {
        include: [
          { model: db.strategy_image, as: 'images' },
          { model: db.aliases, as: 'aliases' }
        ]
      })
      expect(result).toEqual(createdStrategy)
    })
  })

  describe('update', () => {
    it('should update a strategy', async () => {
      const strategyId = 1
      const strategy = { name: 'Updated Strategy' }

      db.architecture_strategy.update.mockResolvedValue([1])

      const result = await StrategyRepository.update(strategyId, strategy)

      expect(db.architecture_strategy.update).toHaveBeenCalledWith(strategy, {
        where: { id: strategyId }
      })
      expect(result).toStrictEqual([1])
    })
  })

  describe('pagination', () => {
    it('should retrieve strategies with pagination and filters', async () => {
      const name = 'Strategy'
      const type = 'tactic'
      const attributes = { c: 'value1', i: 'value2' }
      const strategies = [
        { id: 1, name: 'Strategy 1' },
        { id: 2, name: 'Strategy 2' }
      ]

      db.architecture_strategy.findAndCountAll.mockResolvedValue({
        rows: strategies,
        count: strategies.length
      })

      const result = await StrategyRepository.pagination(name, type, attributes)

      expect(result.rows.length).toBe(2)
    })

    it('should retrieve strategies with pagination', async () => {
      const name = 'Strategy'
      const type = 'tactic'
      const attributes = { x: 'value1', y: 'value2' }
      const strategies = [
        { id: 1, name: 'Strategy 1' },
        { id: 2, name: 'Strategy 2' }
      ]

      db.architecture_strategy.findAndCountAll.mockResolvedValue({
        rows: strategies,
        count: strategies.length
      })

      const result = await StrategyRepository.pagination(name, type, attributes)

      expect(result.rows.length).toBe(2)
    })
  })
})
