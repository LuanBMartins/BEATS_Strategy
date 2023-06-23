const commentServices = require('../services/comment_services')

module.exports = class commentControllers {
  static async readComments (req, res) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(500).send()
      }
      const comments = await commentServices.readComments(id)
      if (comments.length < 1) {
        return res.status(200).send({ error_message: 'comment does not exist' })
      }
      return res.status(200).send({ comments })
    } catch (error) {
      console.log('🚀 ~ file: comment_controllers.js:43 ~ comment_controllers ~ readComment ~ error:', error)
      return res.status(500).send()
    }
  }

  static async readComment (req, res) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(500).send()
      }
      const comments = await commentServices.readComment(id)
      if (comments.length < 1) {
        return res.status(200).send({ error_message: 'comment does not exist' })
      }
      return res.status(200).send(comments)
    } catch (error) {
      console.log('🚀 ~ file: comment_controllers.js:43 ~ comment_controllers ~ readComment ~ error:', error)
      return res.status(500).send()
    }
  }

  static async postComment (req, res) {
    try {
      const { id } = req.params
      const commentInsert = await commentServices.commentStrategy(id, req.user_info.username, req.body.text)
      if (!commentInsert) {
        return res.status(404).send({ error_message: 'strategy does not exist' })
      }
      return res.status(201).send({ message: 'success: comment inserted', comment: commentInsert })
    } catch (error) {
      return res.status(500).send()
    }
  }

  static async postReplyComment (req, res, next) {
    try {
      const { id } = req.params
      const { strategyId } = req.params
      const reply = await commentServices.replyCommentStrategy(id, strategyId, req.user_info.username, req.body.text)
      if (!reply) {
        return res.status(400).send({
          success: false,
          message: 'Invalid comment!'
        })
      }
      return res.status(201).send({ success: true, comment: reply })
    } catch (error) {
      console.log('🚀 ~ file: comment_controllers.js:106 ~ comment_controllers ~ postReplyComment ~ error:', error)
      return res.status(500).send({ success: false, message: 'Server Error!' })
    }
  }

  static async deleteComment (req, res, next) {
    try {
      const { id } = req.params
      const user = req.user_info
      const comment = await commentServices.getCommentById(id)
      if (!comment) {
        return res.status(404).send({ error_message: 'comment does not exist' })
      }
      if (user.username !== comment.username) {
        return res.status(401).send({ message: 'Unauthorized!' })
      }
      await commentServices.removeComment(id)
      return res.status(200).send({ message: 'success: comment deleted' })
    } catch (error) {
      console.log('🚀 ~ file: comment_controllers.js:135 ~ comment_controllers ~ deleteComment ~ error:', error)
      return res.status(500).send({ message: 'Server Error!' })
    }
  }

  static async editComment (req, res, next) {
    try {
      const { id } = req.params
      const user = req.user_info
      const comment = await commentServices.getCommentById(id)
      if (user.username !== comment.username) {
        return res.status(401).send({ message: 'Unauthorized!' })
      }
      const commentEdit = await commentServices.updateCommentText(id, req.body.text)
      if (!commentEdit) {
        return res.status(404).send({
          success: false,
          message: 'comment does not exist'
        })
      }
      return res.status(200).send({ successs: true, message: 'Comment update!' })
    } catch (error) {
      return res.status(500).send({ successs: false, message: 'Server Error!' })
    }
  }
}
