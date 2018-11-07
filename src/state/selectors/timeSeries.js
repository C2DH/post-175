import { createSelector } from 'reselect'

export const getTimeSeries = state => state.timeSeries.data

const makeRowsByYear = (rows, col, columns) => {
  return rows.reduce((rowsByYear, row) => {
    if (row[col] === 'no data available') {
      return rowsByYear
    }

    const year = +row[columns[0]]
    const value = +row[col].replace(/ /g, '').replace(',', '.')

    return {
      ...rowsByYear,
      [year]: value,
    }

  }, {})
}

export const getTimeSeriesByIndicator = createSelector(
  getTimeSeries,
  series => {
    if (series === null) {
      return null
    }
    const { rows, columns } = series
    // Exclude year
    const cleanColumns = columns.slice(1)

    const seriesByIndicator = cleanColumns.reduce((seriesByIndicator, col) => {
      return {
        ...seriesByIndicator,
        [col]: makeRowsByYear(rows, col, columns),
      }
    }, {})

    return seriesByIndicator

  }
)
