import React, { PureComponent } from "react";
import classNames from 'classnames'
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import {
  getTimelineYearsWithEvents,
  getTimelineTopScale,
  getTimelineCurrentDate,
  getEventsExtent,
  WIDTH_WITH_EVENTS,
  EVENT_NO_IMAGE_HEIGHT,
} from "../../state/selectors";
import TimelineNavigation from "../TimelineNavigation";
import TimelineFilters from "../TimelineFilters";
import { last, get, sum } from "lodash";
import { Motion, spring } from "react-motion";
import MultiText from "../../components/MultiText";
import { DraggableCore } from "react-draggable";
import { setDateTimeline, selectEvent } from "../../state/actions";
import { getEventColor } from "../../utils";
import "./Timeline.scss";

const TIMELINE_PADDING = 30;
const EVENT_WIDTH = 150;
const EVENT_RADIUS = 8;
const EVENT_PADDING_TOP = 50
const MIN_VERTIAL_PADDING_EVENTS = 5

class EventItem extends PureComponent {
  render() {
    const {
      event,
      selectEvent,
      scale,
      height,
      enterEvent,
      leaveEvent
    } = this.props;

    // Padding for top year header
    const availableHeight = height - EVENT_PADDING_TOP

    const snapshot = get(event, 'documents[0].data.resolutions.low.url')

    // Height of event image
    const imageHeight = event.imageHeight

    // Total height occuped by events \w same displacementId
    let totalOccupedHeight = event.totalOccupedHeight

    // List of events \w same displacementId heights
    let occupedHeights = event.occupedHeights

    // Event has an image associated?
    let hasImage = !!snapshot

    // Not feet in current height...
    if (event.totalOccupedHeight > availableHeight - (event.displacementCount + 1) * MIN_VERTIAL_PADDING_EVENTS) {
      // FIXME this is a very stupid implementation

      // Force no image
      hasImage = false

      totalOccupedHeight = event.displacementCount * EVENT_NO_IMAGE_HEIGHT

      // All \w no images
      occupedHeights = occupedHeights.map(() => EVENT_NO_IMAGE_HEIGHT)
    }

    const spacer = (availableHeight - totalOccupedHeight) / (event.displacementCount + 1)

    const y2 = (
      sum(occupedHeights.slice(0, event.displacementIndex - 1)) +
      event.displacementIndex * spacer +
      EVENT_PADDING_TOP
    )

    let lineY2 = y2 - (EVENT_RADIUS / 2)

    if (hasImage) {
      lineY2 += 30 + imageHeight
    } else {
      lineY2 += 25
    }

    const color = getEventColor(event);

    return (
      <g
        onClick={() => selectEvent(event)}
        onMouseEnter={() => enterEvent(event)}
        onMouseLeave={() => leaveEvent(event)}
        className={classNames('event-item', {
          'hidden-image': !hasImage,
        })}
      >
        {hasImage && (
          <g
            className='timeline-g-click'
            transform={`translate(${scale(event.startDate)}, ${y2})`}
          >
            <g transform={"translate(10, 0)"}>
              <MultiText
                spacing={25}
                y={55 + imageHeight}
                className="timeline-event-title"
                text={event.data.title}
                maxLine={2}
                maxLen={25}
              />
              <text className="timeline-event-date">
                {event.data.start_date}
              </text>
              <text
                dy={30 + imageHeight}
                fill={color}
                className="timeline-event-category"
              >
                {event.data.category_label}
              </text>
            </g>
            <image
              className={classNames({
                'd-none': !hasImage,
              })}
              xlinkHref={snapshot}
              x={1}
              y={EVENT_RADIUS}
              width={EVENT_WIDTH}
              height={imageHeight}
            />
          </g>
        )}

        {!hasImage && (
          <g
            className="timeline-g-click"
            transform={`translate(${scale(event.startDate) + 10}, ${y2})`}
          >
            <MultiText
              spacing={25}
              y={50}
              className="timeline-event-title"
              text={event.data.title}
              maxLine={2}
              maxLen={25}
            />
            <text className="timeline-event-date">{event.data.start_date}</text>
            <text dy={25} fill={color} className="timeline-event-category">
              {event.data.category_label}
            </text>
          </g>
        )}

        <line
          x1={scale(event.startDate)}
          x2={scale(event.startDate)}
          y1={0}
          y2={lineY2}
          stroke={color}
        />
        <circle
          cx={scale(event.startDate)}
          cy={lineY2}
          fill={color}
          fillOpacity={0.4}
          r={EVENT_RADIUS}
        />
        <circle
          cx={scale(event.startDate)}
          cy={lineY2}
          stroke={color}
          fill={color}
          r={EVENT_RADIUS / 2}
        />
      </g>
    );
  }
}

const mapStateToProps = state => ({
  years: getTimelineYearsWithEvents(state),
  scale: getTimelineTopScale(state),
  currentDate: getTimelineCurrentDate(state),
  extent: getEventsExtent(state)
});

const TimelineEvents = connect(
  mapStateToProps,
  { setDateTimeline, selectEvent }
)(
  class extends PureComponent {
    state = {
      height: 0,
      overEvent: null
    };

    enterEvent = event => this.setState({ overEvent: event });

    leaveEvent = event => this.setState({ overEvent: null });

    componentDidMount() {
      this.setHeight();
      window.addEventListener("resize", this.setHeight, false);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.setHeight);
    }

    setHeight = () => {
      const node = ReactDOM.findDOMNode(this);
      const height = node.offsetHeight;
      this.setState({ height });
    };

    onDrag = (e, data) => {
      const { scale, currentDate, setDateTimeline, extent } = this.props;
      const x = scale(currentDate);
      const newX = x - data.deltaX;
      const newDate = scale.invert(newX);
      if (newDate < extent[0] || newDate > extent[1]) {
        return;
      }
      setDateTimeline(newDate);
    };

    render() {
      const { years, scale, currentDate, selectEvent } = this.props;
      const { height = 0, overEvent } = this.state;
      const width =
        last(scale.range()) + TIMELINE_PADDING * 2 + WIDTH_WITH_EVENTS;
      const x = -scale(currentDate);

      return (
        <div className="h-100 TimelineEvents">
          <Motion defaultStyle={{ x: 0 }} style={{ x: spring(x) }}>
            {({ x }) => (
              <DraggableCore handle=".handle" onDrag={this.onDrag}>
                <svg
                  className="h-100 handle"
                  width={width}
                  style={{ transform: `translate(${x}px,0)` }}
                >
                  <g transform={`translate(${TIMELINE_PADDING},0)`}>
                    {years.map(year => (
                      <g key={year.year}>
                        <text
                          className="timeline-nav-tick fill-grey"
                          x={scale(year.date)}
                          y={32}
                        >
                          {year.year}
                        </text>
                        {year.events.map(
                          (event, eventIndex) =>
                            overEvent && overEvent.id === event.id ? null : (
                              <EventItem
                                enterEvent={this.enterEvent}
                                leaveEvent={this.leaveEvent}
                                event={event}
                                key={event.id}
                                selectEvent={selectEvent}
                                scale={scale}
                                height={height}
                              />
                            )
                        )}
                      </g>
                    ))}
                    {overEvent && (
                      <EventItem
                        enterEvent={this.enterEvent}
                        leaveEvent={this.leaveEvent}
                        event={overEvent}
                        selectEvent={selectEvent}
                        scale={scale}
                        height={height}
                      />
                    )}
                  </g>
                </svg>
              </DraggableCore>
            )}
          </Motion>
        </div>
      );
    }
  }
);

export default class Timeline extends PureComponent {
  render() {
    const { style } = this.props;
    return (
      <div className={`flex-grow-1 d-flex flex-column w-100`} style={style}>
        <div className="flex-grow-0 flex-shrink-0 filters-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <TimelineFilters />
              </div>
            </div>
          </div>
        </div>

        <div
          className="align-self-stretch flex-1 w-100"
          style={{ overflow: "hidden" }}
        >
          <TimelineEvents />
        </div>

        <div className="flex-grow-0 flex-shrink-0 position-relative navigation-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <TimelineNavigation />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
