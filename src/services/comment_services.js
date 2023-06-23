const commentRepository = require('../infra/repositories/comment-repository')

module.exports = class commentServices {
  static async readComments (strategyId) {
    if (!strategyId) {
      return []
    }

    const comments = await commentRepository.findByStrategy(strategyId)
    return comments
  }

  static async readComment (commentId) {
    if (!commentId) {
      return []
    }

    const comments = await commentRepository.findByComment(commentId)
    return comments
  }

  static async getCommentById (commentId) {
    if (!commentId) {
      return false
    }

    const comments = await commentRepository.getComment(commentId)
    return comments
  }

  static async removeComment (commentId) {
    if (!commentId) {
      return false
    }

    return await commentRepository.delete(commentId)
  }

  static async commentStrategy (strategyId, author, commentText) {
    try {
      const comment = await commentRepository.insert({
        strategy_id: strategyId,
        username: author,
        text: commentText
      })

      return comment
    } catch (err) {
      console.log(err)
      return false
    }
  }

  static async replyCommentStrategy (id, strategyId, author, replyText) {
    try {
      const reply = await commentRepository.insert({
        strategy_id: strategyId,
        username: author,
        text: replyText,
        base_comment: id
      })
      return reply
    } catch (err) {
      console.log(err)
    }
  }

  static async updateCommentText (id, textEdit) {
    const commentEdit = await commentRepository.update(id, {
      text: textEdit
    })

    return !!commentEdit[0]
  }
}
