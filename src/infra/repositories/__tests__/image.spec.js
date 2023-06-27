const db = require('../../database/models')
const StrategyImageRepository = require('../strategy-images-repository')

jest.mock('../../database/models')

describe('StrategyImageRepository', () => {
  describe('findById', () => {
    it('should find strategy images by strategy ID', async () => {
      const id = 1
      const strategyImages = [
        { id: 1, strategy_id: id, image: 'image1.jpg' },
        { id: 2, strategy_id: id, image: 'image2.jpg' }
      ]

      db.strategy_image.findAll.mockResolvedValue(strategyImages)

      const result = await StrategyImageRepository.findById(id)

      const expectedWhere = { strategy_id: id }

      expect(db.strategy_image.findAll).toHaveBeenCalledWith({
        where: expectedWhere
      })

      expect(result).toEqual(strategyImages)
    })
  })
})
