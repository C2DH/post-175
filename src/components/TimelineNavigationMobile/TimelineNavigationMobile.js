import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import { timeYear } from "d3-time";
import { scaleTime } from "d3-scale";
import { bisector } from "d3-array";
import classnames from "classnames";
import {
  getFilteredEvents,
  getPeriodsExtent,
  getTimelineCurrentDate,
  getPeriods,
  getTimelineTopScale
} from "../../state/selectors";
import { setDateTimeline } from "../../state/actions";
import { getEventColor } from "../../utils";
import TimelinePeriodsMobile from "../TimelinePeriodsMobile";
import "./TimelineNavigationMobile.scss";

class TimelineNavigationMobile extends PureComponent {
  onEventClicked = decade => {
    const bisecDate = bisector(d => d.startDate).right;
    const bisectIndex = bisecDate(this.props.events, decade);
    this.props.setDateTimeline(this.props.events[bisectIndex].startDate);
  };

  isActive = (decade, currentDate) => {
    return (
      decade.getTime() ===
      new Date(this.round(currentDate.getFullYear(), 10), 0, 1).getTime()
    );
  };

  round = (n, to) => {
    return n - (n % to);
  };

  render() {
    const {
      extent,
      events,
      periods,
      currentDate,
      setDateTimeline,
      scale
    } = this.props;

    const decades = extent
      ? timeYear.range(
          new Date(this.round(extent[0].getFullYear(), 10), 0, 1),
          new Date(this.round(extent[1].getFullYear(), 10) + 10, 0, 1),
          10
        )
      : [];

    const decadeWidth = 150;
    const eventsScale = scaleTime()
      .domain([decades[0], timeYear.ceil(decades.pop(), 10)])
      .range([0, decades.length * decadeWidth]);

    const radius = 4;

    return (
      <div className="TimelineNavigationMobile">
        {periods && (
          <TimelinePeriodsMobile
            periods={periods}
            currentDate={currentDate}
          ></TimelinePeriodsMobile>
        )}
        <div className="d-flex flex-nowrap overflow-auto position-relative decadesContainer">
          {decades.map((decade, i) => {
            return (
              <div
                className={classnames("decade", {
                  active: this.isActive(decade, currentDate)
                })}
                style={{ minWidth: decadeWidth }}
                key={i}
                onClick={() => this.onEventClicked(decade)}
              >
                {decade.getFullYear()}
              </div>
            );
          })}
          <svg
            className="pointEvent"
            width={decades.length * decadeWidth}
            height={radius * 2}
          >
            {events.map(event => {
              return (
                <circle
                  key={event.id}
                  r={radius}
                  fill={getEventColor(event)}
                  cx={eventsScale(event.startDate)}
                  cy={radius}
                ></circle>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentDate: getTimelineCurrentDate(state),
  events: getFilteredEvents(state),
  periods: getPeriods(state),
  extent: getPeriodsExtent(state),
  scale: getTimelineTopScale(state)
});
export default connect(
  mapStateToProps,
  {
    setDateTimeline
  }
)(TimelineNavigationMobile);
