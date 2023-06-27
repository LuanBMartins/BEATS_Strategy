const express = require('express')
const router = express.Router()
const strategyController = require('../controllers/strategy_controllers')

router.get('/strategies', strategyController.searchStrategies)
router.get('/strategies/:id', strategyController.getStrategy)

module.exports = router
