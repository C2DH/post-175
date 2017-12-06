import { mapValues, isPlainObject } from 'lodash'

export const translateDoc = (doc, langCode) => {
  const transObj = (obj, key, sourceObj) => {
    if (isPlainObject(obj)) {
      if (typeof obj[langCode] !== 'undefined') {
        return obj[langCode]
      }
      return mapValues(obj, transObj)
    }
    return obj
  }

  return mapValues(doc, transObj)
}
