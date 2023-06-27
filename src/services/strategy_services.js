const strategiesRepository = require('../infra/repositories/architecture-strategy-repository')
const imagesRepository = require('../infra/repositories/strategy-images-repository')
const aliasesRepository = require('../infra/repositories/aliases-repository')
const { getImageFile } = require('./utils/getFile')

module.exports = class strategyServices {
  static async getStrategiesFiltered (name, type, attributes) {
    const strategies = await strategiesRepository.pagination(name, type, attributes)
    return strategies
  }

  static async getStrategiesById (id) {
    const strategy = await strategiesRepository.findById(id)
    const aliases = await aliasesRepository.findByStrategy(strategy.id)
    const imagesByStrategy = await imagesRepository.findById(strategy.id)
    const images = await Promise.all(imagesByStrategy.map(async (value) => {
      return {
        file: await getImageFile(value.origin)
      }
    }))

    return { ...strategy, images, aliases }
  }
}
