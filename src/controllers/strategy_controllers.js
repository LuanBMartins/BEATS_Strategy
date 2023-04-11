/* eslint-disable */
const strategyServices = require('../services/strategy_services')

module.exports = class strategyControllers {
  static async searchStrategies(req, res, next) {
    const attributes = {
      c: false,
      i: false,
      a: false,
      authn: false,
      authz: false,
      acc: false,
      nr: false
    }
    

    if (req.query.attr) {
      const attributesArray = Array.isArray(req.query.attr) ? req.query.attr : [req.query.attr]
      const invalidAttributes = attributesArray.filter(attr =>  !(attr in attributes))

      if (invalidAttributes.length > 0) {
        return res.status(400).send({ 
          success: false,
          message: `infosec attribute '${invalidAttributes[0]}' does not exist` 
        })
      }

      attributesArray.forEach(attr => {
        attributes[attr.toLowerCase()] = true
      })
    }

    const name = req.query.name ? req.query.name : ''
    let strategyType = req.query.type ? req.query.type.toUpperCase() : ''

    let type = -1
    switch (strategyType) {
      case 'PATTERN':
        type = 0
        break
      case 'TACTIC':
        type = 1
        break
      default:
        if (strategyType) {
          return res.status(400).send({ error_message: `strategy type '${strategyType}' does not exist` })
        }
    }

    const strategies = await strategyServices.getStrategiesFiltered(name, type, attributes)
    return res.status(200).send({ strategies })
  }

  static async getStrategy(req, res, next) {
    const name = req.params.name
    let strategy = await strategyServices.getStrategyByName(name)

    if (!strategy) {
      return res.status(404).send({ error_message: `strategy '${name}' does not exist` })
    }

    const aliases = await strategyServices.getStrategyAliases(name)
    strategy.aliases = aliases

    const documentation = await strategyServices.getStrategyDocumentation(strategy.documentation_path)

    strategy = { ...strategy, ...documentation }
    delete strategy.documentation_path
    delete strategy.images_path
    strategy.type = ['Pattern', 'Tactic'][strategy.type]

    return res.status(200).send(strategy)
  }

  static async listStrategyImagesName(req, res, next) {
    const name = req.params.name

    const strategy = await strategyServices.getStrategyByName(name)
    if (!strategy) {
      return res.status(404).send({ error_message: `strategy '${name}' does not exist` })
    }

    const imgs = await strategyServices.getStrategyImagesNames(strategy.images_path)

    return res.status(200).send({ images_name: imgs })
  }

  static async getStrategyImageByName(req, res, next) {
    const name = req.params.name
    const imageName = req.params.imagename

    const strategy = await strategyServices.getStrategyByName(name)
    if (!strategy) {
      return res.status(404).send({ error_message: `strategy '${name}' does not exist` })
    }

    const imgs = await strategyServices.getStrategyImagesNames(strategy.images_path)
    if (!imgs.includes(imageName)) {
      return res.status(404).send({ error_message: `strategy does not have image '${imageName}'` })
    }

    return res.status(200).sendFile('./public/strategies documentation/' + strategy.images_path + imageName, { root: '.' })
  }
}
