const express = require('express')
const router = express.Router()
const userController = require('../controllers/user_controllers')

const middlewares = require('../middlewares')

router.post('/register', middlewares.assertBodyFields(['username', 'email', 'password', 'github']),
  userController.registerUser)

router.post('/login', middlewares.assertBodyFields(['username', 'password']),
  userController.authenticateUser)

router.get('/profile/:email', middlewares.authorizeUser([0, 1, 2]),
  userController.readProfile)

router.put('/profile/update/:email', middlewares.authorizeUser([0, 1, 2]),
  userController.updateProfile)

module.exports = router
