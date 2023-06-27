const StrategyServices = require('../../strategy_services')
const StrategiesRepository = require('../../../infra/repositories/architecture-strategy-repository')
const ImagesRepository = require('../../../infra/repositories/strategy-images-repository')
const AliasesRepository = require('../../../infra/repositories/aliases-repository')
const { getImageFile } = require('./../../utils/getFile')

jest.mock('../../../infra/repositories/architecture-strategy-repository')
jest.mock('../../../infra/repositories/strategy-images-repository')
jest.mock('../../../infra/repositories/aliases-repository')
jest.mock('./../../utils/getFile')

describe('StrategyServices', () => {
  describe('getStrategiesFiltered', () => {
    it('should return filtered strategies', async () => {
      const name = 'Strategy 1'
      const type = 'tactic'
      const attributes = ['attribute1', 'attribute2']
      const strategies = [{ id: 1, name: 'Strategy 1' }, { id: 2, name: 'Strategy 2' }]

      StrategiesRepository.pagination.mockResolvedValue(strategies)

      const result = await StrategyServices.getStrategiesFiltered(name, type, attributes)

      expect(StrategiesRepository.pagination).toHaveBeenCalledWith(name, type, attributes)
      expect(result).toEqual(strategies)
    })
  })

  describe('getStrategiesById', () => {
    it('should return strategy by ID with aliases and images', async () => {
      const id = 1
      const strategy = { id: 1, name: 'Strategy 1' }
      const aliases = [{ name: 'Alias 1' }]
      const imagesByStrategy = [{ origin: 'image1.png' }, { origin: 'image2.png' }]
      const images = [{ file: 'image' }, { file: 'image' }]

      StrategiesRepository.findById.mockResolvedValue(strategy)
      AliasesRepository.findByStrategy.mockResolvedValue(aliases)
      ImagesRepository.findById.mockResolvedValue(imagesByStrategy)
      getImageFile.mockResolvedValue('image')

      const expectedResult = { ...strategy, images, aliases }

      const result = await StrategyServices.getStrategiesById(id)

      expect(StrategiesRepository.findById).toHaveBeenCalledWith(id)
      expect(AliasesRepository.findByStrategy).toHaveBeenCalledWith(id)
      expect(ImagesRepository.findById).toHaveBeenCalledWith(id)
      expect(getImageFile).toHaveBeenCalledWith('image1.png')
      expect(result).toEqual(expectedResult)
    })
  })
})
