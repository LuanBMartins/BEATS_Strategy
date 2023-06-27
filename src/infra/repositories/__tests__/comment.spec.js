const db = require('../../database/models')
const CommentRepository = require('../comment-repository')

jest.mock('../../database/models')

describe('CommentRepository', () => {
  describe('insert', () => {
    it('should insert a new comment', async () => {
      const comment = { text: 'New comment' }
      const createdComment = { id: 1, text: 'New comment' }

      db.comment.create.mockResolvedValue(createdComment)

      const result = await CommentRepository.insert(comment)

      expect(db.comment.create).toHaveBeenCalledWith(comment)
      expect(result).toEqual(createdComment)
    })
  })

  describe('findByStrategy', () => {
    it('should find comments by strategy ID', async () => {
      const strategyId = 1
      const comments = [
        { id: 1, text: 'Comment 1', get: () => {} },
        { id: 2, text: 'Comment 2', get: () => {} }
      ]

      db.comment.findAll.mockResolvedValue(comments)

      await CommentRepository.findByStrategy(strategyId)

      const expectedWhere = {
        strategy_id: strategyId,
        base_comment: null
      }

      expect(db.comment.findAll).toHaveBeenCalledWith({
        attributes: [['username', 'author'], 'id', 'date', 'text'],
        include: [
          {
            model: db.comment,
            as: 'replies',
            attributes: [['username', 'author'], 'id', 'date', 'text', 'base_comment'],
            include: [{ model: db.usuario, attributes: ['email'] }],
            order: [[{ model: db.comment, as: 'replies' }, 'id', 'ASC']]
          },
          { model: db.usuario, attributes: ['email'] }
        ],
        where: expectedWhere,
        order: [['id', 'ASC'], [{ model: db.comment, as: 'replies' }, 'id', 'ASC']]
      })
    })
  })

  describe('findByComment', () => {
    it('should find a comment by ID', async () => {
      const commentId = 1
      const comment = { id: 1, text: 'Comment', get: () => {} }

      db.comment.findOne.mockResolvedValue(comment)

      const result = await CommentRepository.findByComment(commentId)

      expect(db.comment.findOne).toHaveBeenCalledWith({
        attributes: [['username', 'author'], 'id', 'date', 'text'],
        include: [
          {
            model: db.comment,
            as: 'replies',
            attributes: [['username', 'author'], 'id', 'date', 'text', 'base_comment'],
            order: [['id', 'DESC']]
          }
        ],
        where: { id: commentId },
        order: [['id', 'DESC']]
      })

      expect(result).toEqual(comment.get({ plain: true }))
    })
  })

  describe('getComment', () => {
    it('should retrieve a comment by ID', async () => {
      const commentId = 1
      const comment = { id: 1, text: 'Comment', get: () => {} }

      db.comment.findOne.mockResolvedValue(comment)

      const result = await CommentRepository.getComment(commentId)

      expect(db.comment.findOne).toHaveBeenCalledWith({ where: { id: commentId } })
      expect(result).toEqual(comment)
    })
  })

  describe('delete', () => {
    it('should delete a comment by ID', async () => {
      const commentId = 1

      db.comment.destroy.mockResolvedValue(1)

      const result = await CommentRepository.delete(commentId)

      expect(db.comment.destroy).toHaveBeenCalledWith({ where: { id: commentId } })
      expect(result).toEqual(1)
    })
  })

  describe('update', () => {
    it('should update a comment', async () => {
      const commentId = 1
      const updatedComment = { text: 'Updated comment' }

      db.comment.update.mockResolvedValue(1)

      const result = await CommentRepository.update(commentId, updatedComment)

      expect(db.comment.update).toHaveBeenCalledWith(updatedComment, { where: { id: commentId } })
      expect(result).toEqual(1)
    })
  })
})
