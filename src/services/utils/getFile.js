const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

exports.getImageFile = (filename) => {
  const dir = process.env.PATH_REQUEST + filename.trimEnd()

  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stats) => {
      if (err) {
        console.error('Erro ao obter informações do arquivo:', err)
        reject(err)
        return
      }

      if (stats.isFile()) {
        fs.readFile(dir, 'binary', (err, data) => {
          if (err) {
            console.error('Erro ao ler o arquivo:', err)
            reject(err)
            return
          }

          resolve(data)
        })
      } else {
        const arquivoNaoExiste = 'O arquivo não existe: ' + process.env.PATH_REQUEST + '/' + filename
        reject(new Error(arquivoNaoExiste))
      }
    })
  })
}
