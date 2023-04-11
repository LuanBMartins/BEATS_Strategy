const express = require('express')
const router = express.Router()
const strategyController = require('../controllers/strategy_controllers')

router.get('/strategies', strategyController.searchStrategies)
router.get('/strategies/:name', strategyController.getStrategy)
router.get('/strategies/:name/images', strategyController.listStrategyImagesName)
router.get('/strategies/:name/images/:imagename', strategyController.getStrategyImageByName)

module.exports = router
