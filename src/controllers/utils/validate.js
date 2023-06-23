/**
       * @abstract Remove campos indesejados
       * @param fields
       * @param object
       * @returns
       */

export default (fields, object) => {
  if (!object) {
    return {}
  }
  const newObjet = {}
  Object.getOwnPropertyNames(object)
    .filter(key => fields.includes(key))
    .forEach(key => {
      // eslint-disable-next-line no-return-assign
      return newObjet[key] = object[key]
    })
  return newObjet
}
