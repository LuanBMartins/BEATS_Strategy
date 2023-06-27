const CommentServices = require('../../comment_services')
const CommentRepository = require('../../../infra/repositories/comment-repository')

jest.mock('../../../infra/repositories/comment-repository')

describe('CommentServices', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('readComments', () => {
    it('should return the comments for a strategy', async () => {
      const strategyId = 1
      const expectedComments = [
        { id: 1, text: 'Comment 1' },
        { id: 2, text: 'Comment 2' }
      ]

      CommentRepository.findByStrategy.mockResolvedValue(expectedComments)

      const comments = await CommentServices.readComments(strategyId)

      expect(CommentRepository.findByStrategy).toHaveBeenCalledWith(strategyId)
      expect(comments).toEqual(expectedComments)
    })

    it('should return an empty array if strategy ID is not provided', async () => {
      const strategyId = null

      const comments = await CommentServices.readComments(strategyId)

      expect(CommentRepository.findByStrategy).not.toHaveBeenCalled()
      expect(comments).toEqual([])
    })
  })

  describe('readComment', () => {
    it('should return the comments for a specific comment ID', async () => {
      const commentId = 1
      const expectedComments = [
        { id: 1, text: 'Comment 1' }
      ]

      CommentRepository.findByComment.mockResolvedValue(expectedComments)

      const comments = await CommentServices.readComment(commentId)

      expect(CommentRepository.findByComment).toHaveBeenCalledWith(commentId)
      expect(comments).toEqual(expectedComments)
    })

    it('should return an empty array if comment ID is not provided', async () => {
      const commentId = null

      const comments = await CommentServices.readComment(commentId)

      expect(CommentRepository.findByComment).not.toHaveBeenCalled()
      expect(comments).toEqual([])
    })
  })

  describe('getCommentById', () => {
    it('should return a specific comment by its ID', async () => {
      const commentId = 1
      const expectedComment = { id: 1, text: 'Comment 1' }

      CommentRepository.getComment.mockResolvedValue(expectedComment)

      const comment = await CommentServices.getCommentById(commentId)

      expect(CommentRepository.getComment).toHaveBeenCalledWith(commentId)
      expect(comment).toEqual(expectedComment)
    })

    it('should return false if comment ID is not provided', async () => {
      const result = await CommentServices.getCommentById()
      expect(result).toBe(false)
    })
  })

  describe('removeComment', () => {
    it('should remove a comment by its ID', async () => {
      const commentId = 1

      CommentRepository.delete.mockResolvedValue(true)

      const result = await CommentServices.removeComment(commentId)

      expect(CommentRepository.delete).toHaveBeenCalledWith(commentId)
      expect(result).toBe(true)
    })

    it('should return false if comment ID is not provided', async () => {
      const commentId = null

      const result = await CommentServices.removeComment(commentId)

      expect(CommentRepository.delete).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('commentStrategy', () => {
    it('should insert a new comment for a strategy', async () => {
      const strategyId = 1
      const author = 'JohnDoe'
      const commentText = 'This is a comment'
      const expectedComment = { id: 1, strategy_id: strategyId, username: author, text: commentText }

      CommentRepository.insert.mockResolvedValue(expectedComment)

      const comment = await CommentServices.commentStrategy(strategyId, author, commentText)

      expect(CommentRepository.insert).toHaveBeenCalledWith({
        strategy_id: strategyId,
        username: author,
        text: commentText
      })
      expect(comment).toEqual(expectedComment)
    })

    it('should return false if an error occurs during comment insertion', async () => {
      const strategyId = 1
      const author = 'JohnDoe'
      const commentText = 'This is a comment'

      CommentRepository.insert.mockRejectedValue(new Error('Insertion failed'))

      const result = await CommentServices.commentStrategy(strategyId, author, commentText)

      expect(CommentRepository.insert).toHaveBeenCalledWith({
        strategy_id: strategyId,
        username: author,
        text: commentText
      })
      expect(result).toBe(false)
    })
  })

  describe('replyCommentStrategy', () => {
    it('should insert a reply comment for a strategy', async () => {
      const id = 1
      const strategyId = 1
      const author = 'JohnDoe'
      const replyText = 'This is a reply'
      const expectedReply = { id: 2, strategy_id: strategyId, username: author, text: replyText, base_comment: id }

      CommentRepository.insert.mockResolvedValue(expectedReply)

      const reply = await CommentServices.replyCommentStrategy(id, strategyId, author, replyText)

      expect(CommentRepository.insert).toHaveBeenCalledWith({
        strategy_id: strategyId,
        username: author,
        text: replyText,
        base_comment: id
      })
      expect(reply).toEqual(expectedReply)
    })

    it('should not insert a reply comment if an error occurs', async () => {
      const id = 1
      const strategyId = 1
      const author = 'JohnDoe'
      const replyText = 'This is a reply'

      CommentRepository.insert.mockRejectedValue(new Error('Insertion failed'))

      const result = await CommentServices.replyCommentStrategy(id, strategyId, author, replyText)

      expect(CommentRepository.insert).toHaveBeenCalledWith({
        strategy_id: strategyId,
        username: author,
        text: replyText,
        base_comment: id
      })
      expect(result).toBeUndefined()
    })
  })

  describe('updateCommentText', () => {
    it('should update the text of a comment', async () => {
      const id = 1
      const textEdit = 'Edited comment'
      const commentEdit = [{ id: 1, text: textEdit }]

      CommentRepository.update.mockResolvedValue(commentEdit)

      const result = await CommentServices.updateCommentText(id, textEdit)

      expect(CommentRepository.update).toHaveBeenCalledWith(id, { text: textEdit })
      expect(result).toBe(true)
    })
  })
})
