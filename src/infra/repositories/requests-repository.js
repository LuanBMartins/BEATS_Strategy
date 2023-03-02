const db = require('../database/models')

exports.getRequetsWaitingStatus = () => {
    return db.solicitacao.findAll({
        attributes: [
            ['username', 'author'],
            ['data_solicitacao', 'date_required'],
            ['tipo_solicitacao', 'type'],
            ['nro_protocolo', 'protocol_number'],
            ['estado', 'state'],
            ['administrador', 'administrator'],
            ['voto_admin', 'admin_vote'],
            ['texto_rejeicao', 'rejection_text'],
            ['texto_edicao', 'edit_text'],
            ['estrategia_referente', 'relating_strategy']
            
        ],
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

exports.getById = (id) => {
    return db.solicitacao.findOne({
        where: {
            nro_protocolo: id
        }
    })
}