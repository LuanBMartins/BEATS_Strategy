const requestServices = require('../services/request_services')

module.exports = class requestControllers {
  static async postAddRequestSaveJSON (req, res, next) {
    // eslint-disable-next-line camelcase
    const { body, user_info } = req
    const { files } = req
    try {
      const createStrategyRequest = await requestServices.createStrategyRequest(body, files, user_info)
      if (!createStrategyRequest) {
        return res.status(500).send({
          success: false,
          message: 'Erro ao criar a solicitação!'
        })
      }

      return res.status(201).send({
        success: true,
        message: 'success: strategy add request done'
      })
    } catch (error) {
      return res.status(500).send({
        success: true,
        message: 'Server Error!'
      })
    }
  }

  static async followRequestsStatus (req, res, next) {
    const username = req.user_info.username
    const requests = await requestServices.getRequestsByUser(username)

    res.status(200).send({ requests })
  }

  static async followRequestsWaitingApproval (req, res, next) {
    try {
      const username = req.user_info.username
      const requests = await requestServices.getRequetsWaitingStatus(username)

      res.status(200).send({ requests })
    } catch (error) {
      return res.status(500).send('Server Error!')
    }
  }

  static async readRequestById (req, res) {
    try {
      const { id } = req.params

      if (!id || !parseInt(id)) {
        return res.status(400).send('Parametro inválido!')
      }
      const request = await requestServices.getRequestsById(id)
      if (!request) {
        return res.status(200).send({ success: false, message: 'Request not found!' })
      }
      return res.status(200).send({ request })
    } catch (error) {
      console.log('🚀 ~ file: request_controllers.js:89 ~ request_controllers ~ readRequestById ~ error:', error)
      return res.status(500).send('Server Error!')
    }
  }

  static async deleteRequest (req, res) {
    const { protocol } = req.params
    try {
      if (!protocol) {
        return res.status(500).send({
          success: false,
          message: 'Server Error'
        })
      }

      const request = await requestServices.deleteRequest(protocol)
      if (!request.delete) {
        console.log('🚀 ~ file: request_controllers.js:84 ~ request_controllers ~ deleteRequest ~ request.delete', request.delete)
        return res.status(404).send({
          success: false,
          message: 'Request not found!'
        })
      }

      return res.status(200).send({
        success: true,
        message: 'request has been removed!'
      })
    } catch (error) {
      console.log('🚀 ~ file: request_controllers.js:91 ~ request_controllers ~ deleteRequest ~ error', error)
      return res.status(500).send({
        success: true,
        message: 'Server Error!'
      })
    }
  }
}
