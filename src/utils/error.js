export default class HttpError extends Error {
  constructor (status, message) {
    super()
    this.status = status || 500
    this.message = message
  }
}
