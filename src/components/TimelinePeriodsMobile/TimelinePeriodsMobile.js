import React, { PureComponent, Fragment } from "react";
import classNames from "classnames";
import { Collapse } from "reactstrap";
import "./TimelinePeriodsMobile.scss";

class Period extends PureComponent {
  state = { collapse: false };

  toggle = () => {
    this.setState(state => ({ collapse: !state.collapse }));
  };

  render() {
    const { period, currentDate } = this.props;
    const hovered =
      currentDate.getFullYear() >= period.startDate.getFullYear() &&
      currentDate.getFullYear() <= period.endDate.getFullYear();

    return (
      <div className={classNames("period", { "d-none": !hovered })}>
        <div className="d-flex">
          <span className="text-center flex-grow-1">
            {period.startDate.getFullYear()}-{period.endDate.getFullYear()}
          </span>
          <span className="flex-grow-0 d-flex" onClick={this.toggle}>
            <i className="material-icons">
              {this.state.collapse
                ? "keyboard_arrow_down"
                : "keyboard_arrow_up"}
            </i>
          </span>
        </div>
        <Collapse isOpen={this.state.collapse}>
          <p className="description">{period.data.description}</p>
        </Collapse>
      </div>
    );
  }
}

export default class TimelinePeriodsMobile extends PureComponent {
  render() {
    const { periods, currentDate } = this.props;
    return (
      <div className="TimelinePeriodsMobile">
        {periods.map(period => {
          return (
            <Period
              period={period}
              currentDate={currentDate}
              key={period.id}
            ></Period>
          );
        })}
      </div>
    );
  }
}
