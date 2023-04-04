const express = require('express')
const router = express.Router()
const voteController = require('../controllers/vote_controllers')

const middlewares = require('../middlewares')

router.post('/vote/:protocol', middlewares.authorizeUser([1, 2]),
  voteController.voteAssert,
  voteController.adminVote
)

module.exports = router
