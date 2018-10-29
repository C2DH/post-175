import { createSelector } from 'reselect'
import get from 'lodash/get'
import { getSelectedLangCode } from './lang'
import { translateDoc } from './common'

export const getCollectionDocuments = createSelector(
  state => state.collectionDocs.ids,
  state => state.collectionDocs.data,
  getSelectedLangCode,
  (ids, data, langCode) => ids === null
    ? null
    : ids.map(id => translateDoc(data[id], langCode))
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
