const db = require('../database/models')

exports.getRequetsWaitingStatus = () => {
    return db.solicitacao.findAll({
        where: {
            estado: 0
        }
    })
}

exports.deleteRequest = (protocol) => {
    return db.solicitacao.destroy({
        where: {
            nro_protocolo: protocol
        }
    })
}