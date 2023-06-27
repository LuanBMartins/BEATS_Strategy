const strategyServices = require('../services/strategy_services')

module.exports = class strategyControllers {
  static async searchStrategies (req, res, next) {
    try {
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
        const invalidAttributes = attributesArray.filter(attr => !(attr in attributes))

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
      const strategyType = req.query.type ? req.query.type.toUpperCase() : ''

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
    } catch (error) {
      return res.status(500).send('Server Error!')
    }
  }

  static async getStrategy (req, res, next) {
    try {
      const id = req.params.id
      const strategy = await strategyServices.getStrategiesById(id)
      if (!strategy) {
        return res.status(404).send({
          success: false,
          error_message: 'strategy does not exist!'
        })
      }

      return res.status(200).send(strategy)
    } catch (error) {
      return res.status(500).send('Server Error!')
    }
  }
}
