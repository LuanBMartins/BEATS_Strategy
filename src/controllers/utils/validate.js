/**
       * @abstract Remove campos indesejados
       * @param fields
       * @param object
       * @returns
       */

module.exports = (fields, object) => {
  if (!object) {
    return {}
  }
  const newObjet = {}
  Object.getOwnPropertyNames(object)
    .filter(key => fields.includes(key))
    .forEach(key => {
      // eslint-disable-next-line no-return-assign
      newObjet[key] = object[key]
    })
  return newObjet
}
