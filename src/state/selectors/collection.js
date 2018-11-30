import { createSelector } from 'reselect'
import memoize from 'memoize-one'
import get from 'lodash/get'
import map from 'lodash/map'
import range from 'lodash/range'
import sample from 'lodash/sample'
import { getSelectedLangCode } from './lang'
import { translateDoc } from './common'
import { getDocDetail } from './document'

const getCollectionDocumentsRaw = createSelector(
  state => state.collectionDocs.ids,
  state => state.collectionDocs.data,
  getSelectedLangCode,
  (ids, data, langCode) => ids === null
    ? null
    : ids.map(id => translateDoc(data[id], langCode))
)

export const getCollectionDocumentDetail = memoize(id => createSelector(
  getDocDetail,
  state => state.collectionDocs.data,
  getSelectedLangCode,
  (detailCompleteDoc, dataDocs, langCode) => {
    // If we got the complete detail return that
    if (detailCompleteDoc) {
      return detailCompleteDoc
    }
    // Otherwise return the doc from collection without realted shit
    if (dataDocs[id]) {
      const doc = translateDoc(dataDocs[id], langCode)
      return {
        ...doc,
        documents: [],
      }
    }
    return null
  }
))

export const getCollectionDocuments = createSelector(
  getCollectionDocumentsRaw,
  docs => {
    if (docs === null)  {
      return null
    }
    // TODO: Remove filter by API query....
    const snapDocs = docs.filter(doc => doc.snapshot)

    const docsChunks = snapDocs.reduce((chunks, doc) => {
      const horizontal = doc.data.width > doc.data.height
      const nextDoc = { ...doc, horizontal }
      if (chunks.length === 0) {
        return chunks.concat([[nextDoc]])
      }

      const lastChunk = chunks[chunks.length - 1]
      if (lastChunk.length === 6) {
        return chunks.concat([[nextDoc]])
      } else if (lastChunk.length === 5) {
        if (!lastChunk.some(d => d.horizontal)) {
          chunks[chunks.length - 1] = lastChunk.concat(nextDoc)
          return chunks
        } else {
          return chunks.concat([[nextDoc]])
        }
      } else {
        chunks[chunks.length - 1] = lastChunk.concat(nextDoc)
        return chunks
      }
    }, [])

    const colDocs = map(docsChunks, chunk => {
      if (chunk.length === 6) {
        return chunk
      }
      const horizs = chunk.filter(c => c.horizontal)
      const newChunk = [...chunk]

      if (horizs.length > 0) {
        const horiz = sample(horizs)
        newChunk[newChunk.indexOf(horiz)].large = true
      }

      return newChunk.concat(range(5 - newChunk.length).map(i => ({
        id: `placeholder~${i}`,
        placeholder: true,
      })))
    })

    // console.log('->', docsChunks, colDocs)
    // return snapDocs
    return colDocs
  }
)

const fixFacets = facets => {
  const summedFacet = facets.reduce((summed, facet) => {
    const year = facet.data__year

    if (year === null || isNaN(+year)) {
      return summed
    }

    return {
      ...summed,
      [year]: get(summed, year, 0) + facet.count,
    }

  }, {})
  return Object.keys(summedFacet).map(year => ({
    count: summedFacet[year],
    year: +year,
  }))
}

export const getCollectionsFacets = createSelector(
  state => state.collectionDocs.facets,
  facets => {
    if (!facets) {
      return facets
    }
    const dataYearFacets = facets.data__year
    return {
      data__year: fixFacets(dataYearFacets || []),
    }
  }
)

export const getCollectionsAllFacets = createSelector(
  state => state.collectionFacets.data,
  facets => {
    if (!facets) {
      return facets
    }
    const dataYearFacets = facets.data__year
    return {
      data__year: fixFacets(dataYearFacets || []),
    }
  }
)
