const Joi = require('joi')

module.exports = {
  suggestionCreate: Joi.object({
    title: Joi.string().required().error(new Error('"title" is required')),
    description: Joi.string().required().error(new Error('"description" is required')),
    reference: Joi.string().allow('', null)
  })
}
