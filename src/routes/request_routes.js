const express = require('express')
const router = express.Router()
const requestController = require('../controllers/request_controllers')

const middlewares = require('../middlewares')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = process.env.PATH_REQUEST
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}` + '_' + file.originalname)
  }
})

const multiUpload = multer({ storage }).array('images', 10)

router.get('/requests/', middlewares.authorizeUser([0, 1, 2]), requestController.followRequestsStatus)

router.get('/requests/:id', middlewares.authorizeUser([0, 1, 2]), requestController.readRequestById)

router.get('/requests/waiting/approval', middlewares.authorizeUser([2]), requestController.followRequestsWaitingApproval)

router.post('/requests/addition', middlewares.authorizeUser([0, 1, 2]),
  multiUpload,
  middlewares.strategyBodyValidate(),
  requestController.postAddRequestSaveJSON)

router.delete('/requests/delete/:protocol', middlewares.authorizeUser([0, 1]), requestController.deleteRequest)

module.exports = router
