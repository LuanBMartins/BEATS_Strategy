const db = require('../database/models')

exports.create = (request) => {
  return db.solicitacao.create(request)
}

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
      ['strategy_id', 'relating_strategy'],
      'architecture_strategy.name'
    ],
    where: {
      estado: 0
    },
    include: {
      attributes: [],
      model: db.architecture_strategy
    },
    raw: true
  })
}

exports.getRequestsByUsername = (username) => {
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
      ['strategy_id', 'relating_strategy'],
      'architecture_strategy.name'
    ],
    where: {
      username
    },
    include: {
      attributes: [],
      model: db.architecture_strategy
    },
    raw: true
  })
}

exports.getRequestsByProtocol = (protocol) => {
  return db.solicitacao.findOne({
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
      ['strategy_id', 'relating_strategy']
    ],
    where: {
      nro_protocolo: protocol
    },
    include: {
      attributes: ['id'],
      model: db.architecture_strategy
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
      strategy_id: id
    },
    include: {
      model: db.architecture_strategy
    }
  })
}

exports.update = (protocol, vote) => {
  return db.solicitacao.update(vote, {
    where: {
      nro_protocolo: protocol
    }
  })
}
