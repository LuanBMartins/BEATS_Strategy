const db = require('../../database/models')
const AliasRepository = require('../aliases-repository')

jest.mock('../../database/models')

describe('AliasRepository', () => {
  describe('findByStrategy', () => {
    it('should find aliases by strategy ID', async () => {
      const strategyId = 1
      const aliases = [
        { id: 1, name: 'Alias 1', strategy_id: 1 },
        { id: 2, name: 'Alias 2', strategy_id: 1 }
      ]

      db.aliases.findAll.mockResolvedValue(aliases)

      const result = await AliasRepository.findByStrategy(strategyId)

      expect(db.aliases.findAll).toHaveBeenCalledWith({
        where: { strategy_id: strategyId },
        raw: true
      })
      expect(result).toEqual(aliases)
    })
  })
})
