const express = require('express')
const router = express.Router()
const SuggestionController = require('../controllers/suggestion_controller')

const middlewares = require('../middlewares')

router.post('/suggestion/create',
  middlewares.authorizeUser([0, 1]),
  SuggestionController.create)

router.get('/suggestion/list',
  middlewares.authorizeUser([0, 1, 2]),
  SuggestionController.list)

router.get('/suggestion/read/:id',
  middlewares.authorizeUser([0, 1, 2]),
  SuggestionController.read)

router.delete('/suggestion/delete/:id',
  middlewares.authorizeUser([0, 1, 2]),
  SuggestionController.delete)

module.exports = router
