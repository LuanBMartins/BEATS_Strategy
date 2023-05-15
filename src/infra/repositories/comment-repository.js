const db = require('../database/models')

exports.insert = async (comment) => {
  return db.comment.create(comment)
}

exports.findByStrategy = async (id) => {
  const comments = await db.comment.findAll({
    attributes: [
      ['username', 'author'],
      'id',
      'date',
      'text'
    ],
    include: [{
      model: db.comment,
      as: 'replies',
      attributes: [
        ['username', 'author'],
        'id',
        'date',
        'text',
        'base_comment'
      ]
    }],
    where: {
      strategy_id: id,
      base_comment: null
    }
  })

  return comments.map(node => {
    return node.get({ plain: true })
  })
}

exports.findByComment = async (id) => {
  const comments = await db.comment.findOne({
    attributes: [
      ['username', 'author'],
      'id',
      'date',
      'text'
    ],
    include: [{
      model: db.comment,
      as: 'replies',
      attributes: [
        ['username', 'author'],
        'id',
        'date',
        'text',
        'base_comment'
      ]
    }],
    where: {
      id
    }
  })

  return comments.get({ plain: true })
}
