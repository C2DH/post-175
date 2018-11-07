import React, { PureComponent } from 'react'

class TimeSerie extends PureComponent {
  render() {
    const { column, serie, year } = this.props
    console.log(column, serie)
    return (
      <div>
        <div>{column}</div>
        <div>{serie[year]}</div>
      </div>
    )
  }
}

export default class TimeSeries extends PureComponent {
  render() {
    const { columns, series, year } = this.props
    return (
      <div className="col-md-3">
        {columns.map(col => (
          <TimeSerie
            key={col}
            year={year}
            column={col}
            serie={series[col]}
          />
        ))}
      </div>
    )
  }
}
