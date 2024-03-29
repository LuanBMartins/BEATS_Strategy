const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment_controllers')

const middlewares = require('../middlewares')

// router.get('/strategies/:name/comments', commentController.getComments)
// router.get('/strategies/:name/comments/:id', commentController.getComment)

router.get('/strategies/:id/comments', commentController.readComments)
router.get('/strategies/comment/:id', commentController.readComment)

router.post('/strategies/:id/comments', middlewares.assertBodyFields(['text']),
  middlewares.authorizeUser([0, 1, 2]), commentController.postComment)
router.post('/strategies/:strategyId/comments/:id', middlewares.assertBodyFields(['text']),
  middlewares.authorizeUser([0, 1, 2]), commentController.postReplyComment)

router.delete('/strategies/:strategyId/comments/:id', middlewares.authorizeUser([0, 1, 2]),
  commentController.deleteComment)

router.put('/strategies/:strategyId/comments/:id', middlewares.authorizeUser([0, 1, 2]),
  middlewares.assertBodyFields(['text']), commentController.editComment)

module.exports = router
