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
    include: [
      {
        model: db.comment,
        as: 'replies',
        attributes: [
          ['username', 'author'],
          'id',
          'date',
          'text',
          'base_comment'
        ],
        include: [
          {
            model: db.usuario,
            attributes: ['email']
          }
        ],
        order: [
          [
            { model: db.comment, as: 'replies' },
            'id', 'ASC'
          ]
        ]
      },
      {
        model: db.usuario,
        attributes: ['email']
      }
    ],
    where: {
      strategy_id: id,
      base_comment: null
    },
    order: [
      ['id', 'ASC'],
      [{ model: db.comment, as: 'replies' }, 'id', 'ASC']
    ] // Ordenação dos comentários principais
  })

  return comments.map((node) => {
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
      ],
      order: [['id', 'DESC']]
    }],
    where: {
      id
    },
    order: [['id', 'DESC']]
  })

  return comments.get({ plain: true })
}

exports.getComment = async (id) => {
  return db.comment.findOne({
    where: {
      id
    }
  })
}

exports.delete = async (id) => {
  return db.comment.destroy({
    where: {
      id
    }
  })
}

exports.update = async (id, comment) => {
  console.log('🚀 ~ file: comment-repository.js:92 ~ exports.update= ~ comment:', comment)
  return db.comment.update(comment, {
    where: {
      id
    }
  })
}
