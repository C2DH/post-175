import React, { PureComponent } from "react";
import classNames from "classnames";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Slider from "react-slick";
import memoize from "memoize-one";
import { bisector } from "d3-array";
import LinesEllipsis from "react-lines-ellipsis";
import { getTimelineCurrentDate } from "../../state/selectors";
import TimelineNavigationMobile from "../TimelineNavigationMobile";
import { setDateTimeline, selectEvent } from "../../state/actions";
import { getEventColor } from "../../utils";
import "./TimelineMobile.scss";

const EVENT_RADIUS = 8;

const SlickArrow = props => {
  const { onClick, type, className } = props;
  const disabled = className.match(/slick-disabled/) ? true : false;
  return (
    <div
      className={classNames(`${type}-arrow`, {
        "arrow-disabled": disabled
      })}
    >
      <i className="material-icons" onClick={onClick}>{`arrow_${type}`}</i>
    </div>
  );
};

class TimelineMobile extends PureComponent {
  state = {
    sliderIndex: 0
  };

  beforeChange = index => {
    this.setState({ sliderIndex: index });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentDate.getTime() !== this.props.currentDate.getTime()) {
      const bisecDate = bisector(d => d.startDate).right;
      const bisectIndex =
        bisecDate(this.props.events, this.props.currentDate) - 1;
      if (bisectIndex !== this.state.sliderIndex) {
        this.slider.slickGoTo(bisectIndex, true);
      }
    }
  }

  render() {
    const { events, currentDate, setDateTimeline, selectEvent } = this.props;

    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <SlickArrow type={"forward"} />,
      prevArrow: <SlickArrow type={"back"} />,
      afterChange: () =>
        setDateTimeline(events[this.state.sliderIndex].startDate),
      beforeChange: (current, next) => this.setState({ sliderIndex: next })
    };

    return (
      <div className={`flex-grow-1 d-flex flex-column w-100`}>
        <div className="align-self-stretch flex-1 w-100 TimelineEvents">
          <div className="px-4 h-100" style={{ paddingBottom: 25 }}>
            {events.length > 0 && (
              <Slider ref={slider => (this.slider = slider)} {...settings}>
                {events.map(event => {
                  return (
                    <div key={event.id} className="event-container">
                      <div className="d-flex flex-column justify-content-center h-100">
                        <div className="flex-grow-0">
                          <p className="timeline-event-date pl-4 mb-1">
                            {event.data.start_date}
                          </p>
                        </div>

                        {event.documents.length > 0 && (
                          <img
                            src={event.documents[0].data.resolutions.medium.url}
                            alt={event.documents[0].data.title}
                            className="pl-4 mb-1 event-image"
                          ></img>
                        )}

                        <div className="flex-grow-0">
                          <p
                            style={{
                              color: getEventColor(event)
                            }}
                            className="mb-1 d-flex"
                          >
                            <svg
                              width={EVENT_RADIUS * 2}
                              height={EVENT_RADIUS * 2}
                              className="mr-2 mt-1"
                            >
                              <circle
                                cx="50%"
                                cy="50%"
                                fill={getEventColor(event)}
                                fillOpacity={0.4}
                                r={EVENT_RADIUS}
                              />
                              <circle
                                cx="50%"
                                cy="50%"
                                stroke={getEventColor(event)}
                                fill={getEventColor(event)}
                                r={EVENT_RADIUS / 2}
                              />
                            </svg>
                            <span>{event.data.category_label}</span>
                          </p>
                          <h4
                            className="timeline-event-title pl-4"
                            onClick={() => selectEvent(event)}
                          >
                            {event.documents.length === 0 ? (
                              event.data.title
                            ) : (
                              <LinesEllipsis
                                text={event.data.title}
                                maxLine="2"
                                ellipsis="..."
                                trimRight
                                basedOn="letters"
                              />
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            )}
          </div>
        </div>

        <div className="flex-grow-0 flex-shrink-0 position-relative navigation-container">
          <TimelineNavigationMobile />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentDate: getTimelineCurrentDate(state)
});

export default connect(
  mapStateToProps,
  {
    setDateTimeline,
    selectEvent
  }
)(TimelineMobile);
