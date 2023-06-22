const dbClient = require('../dbconfig').db_client
const fs = require('fs').promises
const strategiesRepository = require('../infra/repositories/architecture-strategy-repository')
const imagesRepository = require('../infra/repositories/strategy-images-repository')
const aliasesRepository = require('../infra/repositories/aliases-repository')
const { getImageFile } = require('./utils/getFile')

module.exports = class strategyServices {
  static async getAllStrategies () {
    try {
      // eslint-disable-next-line no-multi-str
      const text = 'SELECT ea.nome AS name, ea.tipo AS type,\
            ea.c, ea.i, ea.a, ea.authn, ea.authz, ea.acc, ea.nr, s.sinonimo AS aliases\
            FROM estrategia_arquitetural ea\
            LEFT JOIN sinonimo_estrategia s ON ea.nome = s.estrategia'

      const dbStrategies = await dbClient.query(text)

      const strategies = {}

      dbStrategies.rows.forEach(strategy => {
        if (strategies[strategy.name] === undefined) {
          strategies[strategy.name] = strategy
          strategies[strategy.name].aliases = [strategy.aliases]
        } else {
          strategies[strategy.name].aliases.push(strategy.aliases)
        }
      })

      return Object.values(strategies)
    } catch (err) {
      console.log(err)
    }
  }

  static async getStrategiesFiltered (name, type, attributes) {
    const strategies = await strategiesRepository.pagination(name, type, attributes)
    return strategies
  }

  static async getStrategyAliases (name) {
    try {
      // eslint-disable-next-line no-multi-str
      const text = 'SELECT s.sinonimo AS alias\
            FROM estrategia_arquitetural ea\
            JOIN sinonimo_estrategia s ON ea.nome = s.estrategia\
            WHERE ea.nome = $1;'
      const values = [name]

      const dbAliases = await dbClient.query(text, values)

      return dbAliases.rows.map((row) => row.alias)
    } catch (err) {
      console.log(err)
    }
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

  static async getStrategyByName (name) {
    try {
      // eslint-disable-next-line no-multi-str
      const text = 'SELECT ea.nome AS name, ea.tipo AS type,\
            ea.c, ea.i, ea.a, ea.authn, ea.authz, ea.acc, ea.nr,\
            ea.username_criador AS username_creator,\
            ea.data_publicacao AS publish_date,\
            ea.caminho_documentacao AS documentation_path,\
            ea.caminho_imagens AS images_path\
            FROM estrategia_arquitetural ea\
            WHERE ea.nome = $1;'
      const values = [name]

      const dbStrategies = await dbClient.query(text, values)

      if (dbStrategies.rowCount === 0) {
        return null
      }

      return dbStrategies.rows[0]
    } catch (err) {
      console.log(err)
    }
  }

  static async getStrategyDocumentation (documentationPath) {
    try {
      const data = await fs.readFile(process.env.PATH_REQUEST + documentationPath)
      const documentation = JSON.parse(data)

      return documentation
    } catch (err) {
      console.log(err)
    }
  }

  static async strategyExists (name) {
    try {
      // eslint-disable-next-line no-multi-str
      const text = 'SELECT ea.nome\
            FROM estrategia_arquitetural ea\
            WHERE ea.nome = $1;'
      const values = [name]

      const dbStrategies = await dbClient.query(text, values)
      return dbStrategies.rowCount > 0
    } catch (err) {
      console.log(err)
    }
  }

  static async getStrategyImagesNames (imagesPath) {
    try {
      return await fs.readdir(process.env.PATH_DOCUMENTATION + imagesPath)
    } catch (err) {
      console.log(err)
    }
  }
}
