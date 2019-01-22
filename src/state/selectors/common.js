import { mapValues, isPlainObject, isArray } from 'lodash'

export const translateDoc = (doc, langCode) => {
  const transObj = (obj) => {
    if (isPlainObject(obj)) {
      if (typeof obj[langCode] !== 'undefined') {
        return obj[langCode]
      }
      return mapValues(obj, transObj)
    }
    if (isArray(obj)) {
      return obj.map(transObj)
    }
    return obj
  }

  if (isArray(doc)) {
    return doc.map(transObj)
  } else {
    return mapValues(doc, transObj)
  }
}
