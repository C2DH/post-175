import React, { PureComponent } from "react";
import TimeSerieChart from "./TimeSerieChart";
import "./TimeSeries.scss";

class TimeSerie extends PureComponent {
  render() {
    const { column, serie, year, extent } = this.props;
    return (
      <div className="px-3 py-1 d-flex flex-column text-white border-bottom time-serie">
        <div>{column}</div>
        <div className="d-flex time-serie-chart-container">
          <h4>{serie[year] || "-"}</h4>
          <div className="flex-1">
            {extent && (
              <TimeSerieChart year={year} yearExtent={extent} serie={serie} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default class TimeSeries extends PureComponent {
  render() {
    const { columns, series, year, extent } = this.props;
    return (
      <div className="col-md-3 bg-darkgrey time-series">
        {columns.map(col => (
          <TimeSerie
            key={col}
            year={year}
            column={col}
            serie={series[col]}
            extent={extent}
          />
        ))}
      </div>
    );
  }
}
