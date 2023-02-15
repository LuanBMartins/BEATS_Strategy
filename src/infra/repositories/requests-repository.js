const db = require('../database/models')

exports.getRequets = (protocol) => {
}

exports.deleteRequest = (protocol) => {
    return db.solicitacao.destroy({
        where: {
            nro_protocolo: protocol
        }
    })
}