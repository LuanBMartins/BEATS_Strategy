const jwt = require('jsonwebtoken')

function assertBodyFields (bodyFields) {
  return function (req, res, next) {
    const fieldsUndefined = []

    bodyFields.forEach(field => {
      if (!req.body[field]) {
        fieldsUndefined.push(field)
      }
    })

    if (fieldsUndefined.length > 0) {
      return res.status(400).send({
        error_message: 'request should contain the following body fields',
        fields: fieldsUndefined
      })
    }

    next()
  }
}

function strategyBodyValidate () {
  return function (req, res, next) {
    const bodyPayloadValid = ['name', 'type', 'aliases']
    const bodyAttributesValid = ['c', 'i', 'a', 'authn', 'authz', 'acc', 'nr']

    const payloadIsValid = bodyPayloadValid.filter(value => {
      if (!req.body[value]) {
        return value
      } else { return false }
    })

    const payloadAttributesIsValid = bodyAttributesValid.filter(value => {
      if (!req.body[value]) {
        return value
      } else { return false }
    })

    if (payloadIsValid.length >= 3) {
      return res.status(400).send({
        error_message: 'request should contain the following body fields',
        fields: payloadIsValid
      })
    }

    if (payloadAttributesIsValid.length >= 7) {
      return res.status(400).send({
        error_message: 'request should contain the following body fields',
        fields: payloadAttributesIsValid
      })
    }

    next()
  }
}

function authorizeUser (allowedUserTypes) {
  return function (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).send({ error_message: 'include authorization field in header' })
    }

    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
      if (err || !allowedUserTypes.includes(userInfo.user_type)) {
        return res.status(403).send({ error_message: 'unauthorized' })
      }

      req.user_info = userInfo
      next()
    })
  }
}

function preprocessAddRequestForm (req, res, next) {
  const infosecAttributes = ['c', 'i', 'a', 'authn', 'authz', 'acc', 'nr']

  for (const attr of infosecAttributes) {
    const boolString = req.body[attr]
    if (boolString === true || boolString === false) {
      req.body[attr] = boolString === 'TRUE'
    } else {
      return res.status(400).send({ error_message: 'infosec attributes must be written as an boolean' })
    }
  }

  // req.body.aliases = JSON.parse(req.body.aliases);
  if (!Array.isArray(req.body.aliases)) {
    return res.status(400).send({ error_message: 'aliases must be written as an array' })
  }

  next()
}

module.exports = {
  assertBodyFields,
  authorizeUser,
  preprocessAddRequestForm,
  strategyBodyValidate
}
