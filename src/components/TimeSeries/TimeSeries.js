import React, { PureComponent } from "react";
import TimeSerieChart from "./TimeSerieChart";
import "./TimeSeries.scss";
import classNames from "classnames";

class TimeSerie extends PureComponent {
  render() {
    const { column, serie, year, extent, t } = this.props;
    return (
      <div className="col-4 col-lg-12 p-3 text-white border-bottom border-light time-serie">
        <h6 className="text-white-50 mb-1">{t(`${column}-title`)}</h6>
        <p>{t(`${column}-desc`)}</p>
        <h4
          className={classNames("", {
            "text-white-50": !serie[year]
          })}
        >
          {serie[year] >= 0 ? serie[year] : "n/a"}
        </h4>
        <div className="time-serie-chart-container">
          {extent && (
            <TimeSerieChart year={year} yearExtent={extent} serie={serie} />
          )}
        </div>
      </div>
    );
  }
}

export default class TimeSeries extends PureComponent {
  render() {
    const { columns, series, year, extent, t } = this.props;
    return (
      <div className="time-series-container col-lg-4 col-xl-3 d-flex">
        <div className="time-series w-100 d-flex d-lg-block">
          {columns.map(col => (
            <TimeSerie
              t={t}
              key={col}
              year={year}
              column={col}
              serie={series[col]}
              extent={extent}
            />
          ))}
        </div>
      </div>
    );
  }
}
